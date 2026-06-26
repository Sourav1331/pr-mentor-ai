from __future__ import annotations

from collections import Counter
from typing import Any

from .models import ChangedFile, PullRequestAnalysis, ReviewChecklistItem
from .utils import clamp


LOGIC_EXTENSIONS = (".py", ".js", ".jsx", ".ts", ".tsx", ".go", ".rs", ".java", ".rb", ".php")
DOC_EXTENSIONS = (".md", ".rst", ".txt", ".adoc")
SENSITIVE_HINTS = (".env", "secret", "token", "credential", "private_key", "password")


def analyze_pull_request(pr: dict[str, Any], files: list[dict[str, Any]]) -> PullRequestAnalysis:
    changed_files = [
        ChangedFile(
            filename=file.get("filename", ""),
            status=file.get("status", "modified"),
            additions=file.get("additions", 0),
            deletions=file.get("deletions", 0),
            changes=file.get("changes", 0),
        )
        for file in files
    ]
    total_changes = sum(file.changes for file in changed_files)
    file_count = len(changed_files)
    text = _joined_text(pr, changed_files)
    tags = _learning_tags(text, changed_files)
    tests_added = "Testing" in tags
    docs_updated = "Documentation" in tags
    pr_size = _pr_size(total_changes)
    difficulty, difficulty_score = _difficulty(text, changed_files, tags, total_changes)
    checklist = _review_checklist(pr, changed_files, tags, total_changes, difficulty)
    risks = _possible_risks(text, changed_files, tags, total_changes, tests_added)
    summary = _summary(pr, tags, total_changes, file_count)
    beginner_explanation = _beginner_explanation(tags, difficulty, tests_added, docs_updated)

    return PullRequestAnalysis(
        number=pr.get("number", 0),
        title=pr.get("title") or "Untitled pull request",
        url=pr.get("html_url", ""),
        author=(pr.get("user") or {}).get("login", "unknown"),
        created_at=pr.get("created_at", ""),
        state=pr.get("state", "open"),
        body=pr.get("body") or "",
        changed_files_count=file_count,
        additions=sum(file.additions for file in changed_files),
        deletions=sum(file.deletions for file in changed_files),
        existing_labels=[label.get("name", "") for label in pr.get("labels", [])],
        changed_files=changed_files,
        summary=summary,
        beginner_explanation=beginner_explanation,
        difficulty=difficulty,
        difficulty_score=difficulty_score,
        pr_size=pr_size,
        learning_tags=tags,
        review_checklist=checklist,
        suggested_review_comment=_review_comment(difficulty, pr_size, tests_added, docs_updated, tags),
        possible_risks=risks,
        tests_added=tests_added,
        docs_updated=docs_updated,
        confidence=_confidence(changed_files, pr.get("body") or "", tags),
    )


def build_stats(analyses: list[PullRequestAnalysis]) -> dict[str, int]:
    counts = Counter(pr.difficulty for pr in analyses)
    return {
        "beginner_friendly": counts["beginner"],
        "intermediate": counts["intermediate"],
        "advanced": counts["advanced"],
        "tests_added": sum(1 for pr in analyses if pr.tests_added),
        "docs_updated": sum(1 for pr in analyses if pr.docs_updated),
        "large_prs": sum(1 for pr in analyses if pr.pr_size == "large"),
    }


def _joined_text(pr: dict[str, Any], files: list[ChangedFile]) -> str:
    parts = [pr.get("title") or "", pr.get("body") or ""]
    parts.extend(file.filename for file in files)
    return " ".join(parts).lower()


def _learning_tags(text: str, files: list[ChangedFile]) -> list[str]:
    checks = {
        "Backend": lambda: any(file.filename.endswith(".py") for file in files)
        or any(word in text for word in ("api", "server", "route", "controller", "service")),
        "Frontend": lambda: any(file.filename.endswith((".jsx", ".tsx", ".js", ".ts")) for file in files)
        or any(word in text for word in ("component", "page", "ui")),
        "Testing": lambda: any(word in text for word in ("test", "tests", "pytest", "spec")),
        "Documentation": lambda: any(file.filename.upper().endswith(("README.MD", ".MD", ".RST", ".TXT")) for file in files)
        or "docs/" in text,
        "CI/CD": lambda: any(word in text for word in (".github/workflows", "docker", "deploy", " ci ", "pipeline")),
        "Database": lambda: any(word in text for word in ("migration", "schema", ".sql", " db", "database")),
        "Security": lambda: any(word in text for word in ("auth", "token", "permission", "security", "jwt")),
        "Performance": lambda: any(word in text for word in ("cache", "optimize", "performance", "async", "concurrency")),
        "Bug Fix": lambda: any(word in text for word in ("fix", "bug", "error", "crash", "failure")),
        "Refactor": lambda: any(word in text for word in ("refactor", "cleanup", "simplify")),
    }
    tags = [tag for tag, detector in checks.items() if detector()]
    return tags or ["General"]


def _pr_size(total_changes: int) -> str:
    if total_changes <= 50:
        return "small"
    if total_changes <= 400:
        return "medium"
    return "large"


def _difficulty(text: str, files: list[ChangedFile], tags: list[str], total_changes: int) -> tuple[str, int]:
    file_count = len(files)
    docs_only = bool(files) and all(file.filename.lower().endswith(DOC_EXTENSIONS) for file in files)
    tests_only = bool(files) and all("test" in file.filename.lower() or "spec" in file.filename.lower() for file in files)
    advanced_keywords = ("architecture", "security", "auth", "migration", "performance", "concurrency", "permission")

    if any(word in text for word in advanced_keywords) or file_count > 8 or total_changes > 400:
        return "advanced", clamp(7 + total_changes // 400 + file_count // 10, 7, 10)
    if docs_only or tests_only or ("typo" in text and total_changes <= 50) or (file_count <= 2 and total_changes <= 50):
        return "beginner", clamp(2 + total_changes // 25, 1, 4)
    if {"Backend", "Frontend", "Bug Fix", "Refactor"} & set(tags) or file_count <= 8:
        return "intermediate", clamp(5 + total_changes // 150, 5, 7)
    return "intermediate", 6


def _review_checklist(
    pr: dict[str, Any],
    files: list[ChangedFile],
    tags: list[str],
    total_changes: int,
    difficulty: str,
) -> list[ReviewChecklistItem]:
    body = pr.get("body") or ""
    tests_added = "Testing" in tags
    docs_updated = "Documentation" in tags
    logic_changed = any(file.filename.lower().endswith(LOGIC_EXTENSIONS) for file in files)
    sensitive_changed = any(any(hint in file.filename.lower() for hint in SENSITIVE_HINTS) for file in files)
    ci_changed = "CI/CD" in tags

    return [
        ReviewChecklistItem(item="PR has clear description", status="pass" if len(body.strip()) >= 30 else "warning"),
        ReviewChecklistItem(item="Change size is reasonable", status="pass" if total_changes <= 400 else "warning"),
        ReviewChecklistItem(item="Tests are added or updated", status="pass" if tests_added else ("warning" if logic_changed else "pass")),
        ReviewChecklistItem(item="Documentation updated if needed", status="pass" if docs_updated or not logic_changed else "warning"),
        ReviewChecklistItem(item="Files changed match the PR title", status="pass" if _title_matches_files(pr.get("title", ""), tags) else "warning"),
        ReviewChecklistItem(item="Risk level is acceptable", status="pass" if difficulty != "advanced" else "warning"),
        ReviewChecklistItem(item="No sensitive files changed", status="fail" if sensitive_changed else "pass"),
        ReviewChecklistItem(item="CI/CD files changed carefully", status="warning" if ci_changed else "pass"),
    ]


def _title_matches_files(title: str, tags: list[str]) -> bool:
    lowered = title.lower()
    tag_words = {
        "Backend": ("api", "backend", "server", "route"),
        "Frontend": ("ui", "frontend", "component", "page"),
        "Testing": ("test", "spec"),
        "Documentation": ("doc", "readme"),
        "Bug Fix": ("fix", "bug"),
        "Refactor": ("refactor", "cleanup"),
    }
    return any(any(word in lowered for word in tag_words.get(tag, (tag.lower(),))) for tag in tags)


def _possible_risks(
    text: str,
    files: list[ChangedFile],
    tags: list[str],
    total_changes: int,
    tests_added: bool,
) -> list[str]:
    risks: list[str] = []
    if "Security" in tags:
        risks.append("Authentication, token, or permission behavior may change and should be reviewed carefully.")
    if "Database" in tags:
        risks.append("Database or migration changes can affect existing data and deployment order.")
    if len(files) > 8 or total_changes > 400:
        risks.append("This PR is large, so reviewers may miss interactions between changed files.")
    if not tests_added and any(file.filename.lower().endswith(LOGIC_EXTENSIONS) for file in files):
        risks.append("Logic changed without visible test updates, which increases regression risk.")
    if "CI/CD" in tags:
        risks.append("CI/CD changes may affect build, test, or deployment pipelines.")
    if any(any(hint in file.filename.lower() for hint in SENSITIVE_HINTS) for file in files):
        risks.append("Sensitive configuration files appear to be changed and should not expose secrets.")
    return risks or ["No major risk signals were detected from the changed files and PR text."]


def _summary(pr: dict[str, Any], tags: list[str], total_changes: int, file_count: int) -> str:
    title = pr.get("title") or "This PR"
    tag_text = ", ".join(tags[:3]).lower()
    return f"{title} updates {file_count} file(s) with {total_changes} total line changes, mainly touching {tag_text} areas."


def _beginner_explanation(tags: list[str], difficulty: str, tests_added: bool, docs_updated: bool) -> str:
    focus = ", ".join(tags[:3]).lower()
    if difficulty == "beginner":
        return f"This is a beginner-friendly PR to study because it is small or focused on {focus}."
    additions = []
    if tests_added:
        additions.append("how tests support a change")
    if docs_updated:
        additions.append("how documentation is kept in sync")
    detail = f" It also shows {' and '.join(additions)}." if additions else ""
    return f"This PR is useful for learning how contributors modify {focus} in a real project.{detail}"


def _review_comment(difficulty: str, pr_size: str, tests_added: bool, docs_updated: bool, tags: list[str]) -> str:
    if "Documentation" in tags and difficulty == "beginner":
        return "Thanks for improving the documentation. The change looks clear and beginner-friendly."
    if pr_size == "large":
        return "Thanks for the contribution. This PR changes many files, so it may be easier to review if it is split into smaller focused PRs."
    if not tests_added and ("Backend" in tags or "Frontend" in tags):
        return "Thanks for the PR. The change looks useful, but could you add or update tests to cover this behavior?"
    if not docs_updated and "Documentation" not in tags and difficulty != "beginner":
        return "Thanks for the PR. The change looks focused; please confirm whether documentation needs an update for users or maintainers."
    return "Thanks for the PR. The change looks focused and includes relevant updates."


def _confidence(files: list[ChangedFile], body: str, tags: list[str]) -> float:
    score = 0.62
    if files:
        score += 0.12
    if len(body.strip()) >= 30:
        score += 0.1
    if tags != ["General"]:
        score += 0.08
    return round(min(score, 0.92), 2)
