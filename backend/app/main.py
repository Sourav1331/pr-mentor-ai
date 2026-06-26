from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import Settings, get_settings
from .github_client import GitHubClient
from .llm_engine import LLMEngine
from .models import AnalysisStats, AnalyzeRequest, AnalyzeResponse, HealthResponse
from .pr_analyzer import analyze_pull_request, build_stats
from .utils import parse_github_repo_url


app = FastAPI(
    title="PR Mentor AI API",
    description="AI-powered GitHub REST API tool for explaining and reviewing pull requests.",
    version="1.0.0",
)


@app.on_event("startup")
async def configure_cors() -> None:
    settings = get_settings()
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )


@app.get("/health", response_model=HealthResponse)
async def health() -> HealthResponse:
    return HealthResponse(status="ok", message="PR Mentor AI backend is running")


@app.post("/analyze-prs", response_model=AnalyzeResponse)
async def analyze_prs(
    payload: AnalyzeRequest,
    settings: Settings = Depends(get_settings),
) -> AnalyzeResponse:
    owner, repo = parse_github_repo_url(str(payload.repo_url))
    github = GitHubClient(settings)
    llm = LLMEngine(settings)

    pull_requests = await github.fetch_open_pull_requests(owner, repo, payload.max_prs)
    analyses = []
    for pr in pull_requests[: payload.max_prs]:
        number = pr["number"]
        details = await github.fetch_pull_request_details(owner, repo, number)
        files = await github.fetch_pull_request_files(owner, repo, number)
        analysis = analyze_pull_request(details, files)
        if payload.use_llm:
            analysis = await llm.improve_analysis(analysis)
        analyses.append(analysis)

    stats = build_stats(analyses)
    return AnalyzeResponse(
        repo=f"{owner}/{repo}",
        total_prs=len(analyses),
        stats=AnalysisStats(**stats),
        pull_requests=analyses,
    )
