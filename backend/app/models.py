from typing import Literal

from pydantic import BaseModel, Field, HttpUrl


ChecklistStatus = Literal["pass", "warning", "fail"]
Difficulty = Literal["beginner", "intermediate", "advanced"]
PRSize = Literal["small", "medium", "large"]


class AnalyzeRequest(BaseModel):
    repo_url: HttpUrl
    max_prs: int = Field(default=20, ge=1, le=20)
    use_llm: bool = False


class ChangedFile(BaseModel):
    filename: str
    status: str
    additions: int
    deletions: int
    changes: int


class ReviewChecklistItem(BaseModel):
    item: str
    status: ChecklistStatus


class PullRequestAnalysis(BaseModel):
    number: int
    title: str
    url: str
    author: str
    created_at: str
    state: str
    body: str
    changed_files_count: int
    additions: int
    deletions: int
    existing_labels: list[str]
    changed_files: list[ChangedFile]
    summary: str
    beginner_explanation: str
    difficulty: Difficulty
    difficulty_score: int = Field(ge=1, le=10)
    pr_size: PRSize
    learning_tags: list[str]
    review_checklist: list[ReviewChecklistItem]
    suggested_review_comment: str
    possible_risks: list[str]
    tests_added: bool
    docs_updated: bool
    confidence: float = Field(ge=0, le=1)


class AnalysisStats(BaseModel):
    beginner_friendly: int
    intermediate: int
    advanced: int
    tests_added: int
    docs_updated: int
    large_prs: int


class AnalyzeResponse(BaseModel):
    repo: str
    total_prs: int
    stats: AnalysisStats
    pull_requests: list[PullRequestAnalysis]


class HealthResponse(BaseModel):
    status: str
    message: str
