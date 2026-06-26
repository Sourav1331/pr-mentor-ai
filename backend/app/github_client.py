from typing import Any

import httpx
from fastapi import HTTPException

from .config import Settings


class GitHubClient:
    def __init__(self, settings: Settings):
        self.settings = settings
        self.headers = {
            "Accept": "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
            "User-Agent": "pr-mentor-ai",
        }
        if settings.github_token:
            self.headers["Authorization"] = f"Bearer {settings.github_token}"

    async def _get(self, path: str, params: dict[str, Any] | None = None) -> Any:
        url = f"{self.settings.github_api_base_url}{path}"
        async with httpx.AsyncClient(timeout=20) as client:
            response = await client.get(url, headers=self.headers, params=params)

        if response.status_code == 403 and response.headers.get("x-ratelimit-remaining") == "0":
            reset = response.headers.get("x-ratelimit-reset", "later")
            raise HTTPException(
                status_code=429,
                detail=f"GitHub API rate limit exceeded. Add GITHUB_TOKEN or try again after reset time {reset}.",
            )
        if response.status_code == 404:
            raise HTTPException(status_code=404, detail="Repository or pull request was not found.")
        if response.status_code in (401, 403):
            raise HTTPException(
                status_code=response.status_code,
                detail="GitHub API access was denied. Check token permissions if you are using one.",
            )
        if response.status_code >= 400:
            raise HTTPException(
                status_code=response.status_code,
                detail=f"GitHub API error: {response.text[:250]}",
            )
        return response.json()

    async def fetch_open_pull_requests(self, owner: str, repo: str, max_prs: int) -> list[dict[str, Any]]:
        return await self._get(
            f"/repos/{owner}/{repo}/pulls",
            params={"state": "open", "per_page": max_prs, "sort": "created", "direction": "desc"},
        )

    async def fetch_pull_request_details(self, owner: str, repo: str, pull_number: int) -> dict[str, Any]:
        return await self._get(f"/repos/{owner}/{repo}/pulls/{pull_number}")

    async def fetch_pull_request_files(self, owner: str, repo: str, pull_number: int) -> list[dict[str, Any]]:
        return await self._get(
            f"/repos/{owner}/{repo}/pulls/{pull_number}/files",
            params={"per_page": 100},
        )

    async def fetch_pull_request_comments(self, owner: str, repo: str, pull_number: int) -> list[dict[str, Any]]:
        return await self._get(
            f"/repos/{owner}/{repo}/issues/{pull_number}/comments",
            params={"per_page": 30},
        )
