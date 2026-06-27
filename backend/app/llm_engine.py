import json

from groq import Groq

from .config import Settings
from .models import PullRequestAnalysis


class LLMEngine:
    def __init__(self, settings: Settings):
        self.settings = settings
        self.enabled = bool(settings.groq_api_key)
        self.client = None
        if self.enabled:
            try:
                self.client = Groq(api_key=settings.groq_api_key)
            except Exception as exc:
                print(f"Groq client disabled: {exc}")
                self.enabled = False

    async def improve_analysis(self, analysis: PullRequestAnalysis) -> PullRequestAnalysis:
        if not self.enabled or self.client is None:
            return analysis

        prompt = {
            "title": analysis.title,
            "body": analysis.body[:1200],
            "difficulty": analysis.difficulty,
            "pr_size": analysis.pr_size,
            "learning_tags": analysis.learning_tags,
            "changed_files": [file.model_dump() for file in analysis.changed_files[:20]],
            "rule_based_summary": analysis.summary,
            "rule_based_risks": analysis.possible_risks,
        }

        try:
            completion = self.client.chat.completions.create(
                model="llama-3.1-8b-instant",
                messages=[
                    {
                        "role": "system",
                        "content": (
                            "Improve pull request explanations for beginner developers and maintainers. "
                            "Return strict JSON with keys summary, beginner_explanation, "
                            "suggested_review_comment, possible_risks. Keep it concise and professional."
                        ),
                    },
                    {"role": "user", "content": json.dumps(prompt)},
                ],
                temperature=0.2,
                max_tokens=700,
                response_format={"type": "json_object"},
            )
            content = completion.choices[0].message.content or "{}"
            data = json.loads(content)
        except Exception:
            return analysis

        updated = analysis.model_copy(deep=True)
        updated.summary = str(data.get("summary") or analysis.summary)
        updated.beginner_explanation = str(data.get("beginner_explanation") or analysis.beginner_explanation)
        updated.suggested_review_comment = str(
            data.get("suggested_review_comment") or analysis.suggested_review_comment
        )
        risks = data.get("possible_risks")
        if isinstance(risks, list) and risks:
            updated.possible_risks = [str(risk) for risk in risks[:5]]
        return updated
