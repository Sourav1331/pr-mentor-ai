# PR Mentor AI

![Python](https://img.shields.io/badge/Python-3.10%2B-3776AB?logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688?logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-Frontend-61DAFB?logo=react&logoColor=111827)
![GitHub API](https://img.shields.io/badge/GitHub-REST%20API-181717?logo=github&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)

AI-powered GitHub API tool that explains pull requests, reviews changes, and helps beginners learn open-source contribution.

**This project integrates with GitHub using the GitHub REST API.**

## Why This Project Exists

Open-source pull requests can be hard for beginners to understand and time-consuming for maintainers to review. PR Mentor AI turns open GitHub pull requests into structured learning and review guidance: summaries, changed files, contribution difficulty, risk signals, checklist items, and suggested maintainer comments.

The app works locally without paid AI keys. It uses deterministic rule-based analysis by default and can optionally improve summaries with Groq when `GROQ_API_KEY` is configured on the backend.

## Features

- Fetch open pull requests from any public GitHub repository.
- Analyze up to 20 open PRs per request.
- Show simple PR summaries and beginner-friendly explanations.
- Display changed files, additions, deletions, labels, author, creation date, and original PR links.
- Classify difficulty as beginner, intermediate, or advanced.
- Classify PR size as small, medium, or large.
- Generate learning tags such as Backend, Frontend, Testing, Documentation, CI/CD, Database, Security, Performance, Bug Fix, and Refactor.
- Generate maintainer review checklists and suggested review comments.
- Detect tests, docs updates, sensitive files, large-review risk, CI risk, database risk, and missing-test risk.
- Filter and search PRs by title, author, difficulty, learning tag, PR size, and test coverage.
- Copy suggested review comments.
- Responsive GitHub-style dashboard with dark mode, loading states, empty states, and error states.
- Optional `GITHUB_TOKEN` support for higher GitHub API rate limits.
- Optional Groq LLM mode that never exposes keys to the frontend.

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, lucide-react
- Backend: FastAPI, Python, Pydantic, httpx, python-dotenv
- AI/NLP: rule-based analyzer by default, optional Groq LLaMA enhancement
- API: GitHub REST API

## Screenshots

Add screenshots to the `screenshots/` folder after running the app locally. Suggested captures:

- Repository analysis form
- PR dashboard with stats cards
- PR detail card in dark mode
- Error state for invalid repository URLs

## How It Works

1. A user enters a public GitHub repository URL.
2. The frontend sends `repo_url`, `max_prs`, and `use_llm` to the FastAPI backend.
3. The backend validates the GitHub URL and calls the GitHub REST API.
4. The backend fetches open pull requests, PR details, and changed files.
5. The rule-based analyzer computes difficulty, size, tags, risks, checklist items, and review comments.
6. If `GROQ_API_KEY` exists and `use_llm` is true, Groq improves only the summary, beginner explanation, suggested review comment, and possible risks.
7. The frontend renders a searchable, filterable PR review dashboard.

## GitHub API Endpoints Used

PR Mentor AI uses these GitHub REST API endpoints:

```text
GET https://api.github.com/repos/{owner}/{repo}/pulls
GET https://api.github.com/repos/{owner}/{repo}/pulls/{pull_number}
GET https://api.github.com/repos/{owner}/{repo}/pulls/{pull_number}/files
GET https://api.github.com/repos/{owner}/{repo}/issues/{pull_number}/comments
```

The comments endpoint is implemented in the backend client for future review-context expansion. The current dashboard analysis uses PR list, PR details, and changed files.

## Backend Setup

```powershell
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Alternative direct run from `backend/app`:

```powershell
cd backend\app
python main.py
```

Direct run tries port `8000` first and falls back to `8010`, `8011`, `8012`, or `8020` if Windows blocks a port.

Backend URL:

```text
http://localhost:8000
```

Health check:

```text
http://localhost:8000/health
```

## Frontend Setup

```powershell
cd frontend
npm install
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

## Environment Variables

Backend `backend/.env`:

```env
GITHUB_TOKEN=
GROQ_API_KEY=
ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

Frontend `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:8000
```

`GITHUB_TOKEN` and `GROQ_API_KEY` are optional. Public repositories work without a token, but unauthenticated GitHub requests have lower rate limits. Secrets are read only by the backend and are never sent to the browser.

## Example Repositories To Test

- https://github.com/fastapi/fastapi
- https://github.com/langchain-ai/langchain
- https://github.com/huggingface/transformers
- https://github.com/vercel/next.js

## API Documentation

FastAPI automatically provides interactive docs:

```text
http://localhost:8000/docs
```

### GET `/health`

Response:

```json
{
  "status": "ok",
  "message": "PR Mentor AI backend is running"
}
```

### POST `/analyze-prs`

Request:

```json
{
  "repo_url": "https://github.com/owner/repo",
  "max_prs": 20,
  "use_llm": false
}
```

Response includes repository name, aggregate stats, and analyzed pull requests with summaries, explanations, changed files, difficulty, learning tags, checklist items, review comments, risks, and original GitHub links.

## Developer Program Relevance

PR Mentor AI is a developer tool built on top of the GitHub REST API. It fetches pull requests, analyzes changed files, and provides AI-assisted review guidance for contributors and maintainers. It is designed as a GitHub API integration for improving open-source contribution workflows.

## Security Notes

- `.env` files are ignored by Git.
- Never commit `GITHUB_TOKEN` or `GROQ_API_KEY`.
- The frontend only receives analysis results, never backend secrets.
- The app supports public repositories without a GitHub token.
- Private repositories should only be accessed when a properly scoped backend token is configured.
- Optional Groq requests are made server-side only.

## Future Improvements

- Add GitHub OAuth for authenticated user workflows.
- Include PR review comments and discussion sentiment in the analysis.
- Add issue-to-PR linking for richer contribution context.
- Export review reports as Markdown.
- Add repository history trends for maintainer dashboards.
- Cache GitHub responses to reduce rate-limit pressure.
- Add automated tests for analyzer edge cases and API error handling.

## License

MIT License. See [LICENSE](LICENSE).
