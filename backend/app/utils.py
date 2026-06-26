import re
from urllib.parse import urlparse

from fastapi import HTTPException


GITHUB_REPO_PATTERN = re.compile(
    r"^https?://github\.com/(?P<owner>[A-Za-z0-9_.-]+)/(?P<repo>[A-Za-z0-9_.-]+)/?$"
)


def parse_github_repo_url(repo_url: str) -> tuple[str, str]:
    parsed = urlparse(repo_url)
    normalized = f"{parsed.scheme}://{parsed.netloc}{parsed.path}".rstrip("/")
    match = GITHUB_REPO_PATTERN.match(normalized)
    if not match:
        raise HTTPException(
            status_code=400,
            detail="Enter a valid GitHub repository URL, for example https://github.com/fastapi/fastapi.",
        )

    repo = match.group("repo")
    if repo.endswith(".git"):
        repo = repo[:-4]
    return match.group("owner"), repo


def clamp(value: int, minimum: int, maximum: int) -> int:
    return max(minimum, min(value, maximum))
