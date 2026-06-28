# PR Mentor AI

![Python](https://img.shields.io/badge/Python-3.10%2B-3776AB?logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688?logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-Frontend-61DAFB?logo=react&logoColor=111827)
![GitHub API](https://img.shields.io/badge/GitHub-REST%20API-181717?logo=github&logoColor=white)

AI-powered GitHub API tool that explains pull requests, reviews changes, and helps beginners learn open-source contribution.

**This project integrates with GitHub using the GitHub REST API.**

## Overview

PR Mentor AI is a full-stack developer tool for understanding and reviewing open-source pull requests. A user enters a public GitHub repository URL, and the app fetches open pull requests, analyzes changed files, identifies learning topics, estimates difficulty, detects review risks, and generates maintainer-friendly review guidance.

The project is designed to run locally without paid API keys. It uses rule-based analysis by default. If `GROQ_API_KEY` is configured on the backend and LLM mode is enabled in the UI, Groq is used only to improve summaries, beginner explanations, review comments, and risk wording.

## Key Features

- Fetches open pull requests from public GitHub repositories.
- Uses the GitHub REST API for PR lists, PR details, and changed files.
- Supports optional `GITHUB_TOKEN` for higher GitHub API rate limits.
- Works without `GITHUB_TOKEN` for public repositories.
- Rule-based analysis works without paid AI keys.
- Optional Groq LLM enhancement runs server-side only.
- Never exposes `GITHUB_TOKEN` or `GROQ_API_KEY` to the frontend.
- Shows PR summary, beginner explanation, changed files, additions, deletions, labels, author, creation date, and GitHub PR link.
- Classifies PR difficulty as beginner, intermediate, or advanced.
- Classifies PR size as small, medium, or large.
- Detects learning tags including Backend, Frontend, Testing, Documentation, CI/CD, Database, Security, Performance, Bug Fix, and Refactor.
- Generates review checklist items, possible risks, and a suggested maintainer review comment.
- Provides search and filters by title, author, difficulty, tag, PR size, and tests.
- Includes copy-to-clipboard review comments, dark mode, loading states, empty states, and error states.

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, lucide-react
- Backend: FastAPI, Python, Pydantic, httpx, python-dotenv
- AI/NLP: deterministic rule-based analyzer, optional Groq LLaMA enhancement
- External API: GitHub REST API

## Project Structure

```text
pr-mentor-ai/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py
│   │   ├── config.py
│   │   ├── models.py
│   │   ├── github_client.py
│   │   ├── pr_analyzer.py
│   │   ├── llm_engine.py
│   │   └── utils.py
│   ├── requirements.txt
│   ├── .env
│   └── README.md
├── frontend/
│   ├── src/
│   ├── package.json
│   ├── .env
│   └── README.md
├── screenshots/
├── README.md
├── LICENSE
└── .gitignore
```

## How It Works

1. Enter a public GitHub repository URL in the dashboard.
2. The frontend sends `repo_url`, `max_prs`, and `use_llm` to the FastAPI backend.
3. The backend validates the repository URL and calls the GitHub REST API.
4. The backend fetches open PRs, PR details, and changed files.
5. The rule-based analyzer calculates size, difficulty, tags, test/doc signals, risks, checklist items, and review comments.
6. If Groq is configured and LLM mode is enabled, the backend improves selected natural-language fields.
7. The frontend renders a searchable and filterable PR review dashboard.

## GitHub REST API Endpoints Used

```text
GET https://api.github.com/repos/{owner}/{repo}/pulls
GET https://api.github.com/repos/{owner}/{repo}/pulls/{pull_number}
GET https://api.github.com/repos/{owner}/{repo}/pulls/{pull_number}/files
GET https://api.github.com/repos/{owner}/{repo}/issues/{pull_number}/comments
```

The comments endpoint is implemented in the backend client for future review-context expansion. The current dashboard analysis uses PR list, PR details, and changed files.

## Environment Variables

Use real `.env` files for local configuration. No `.env.example` files are required in this project.

Backend: `backend/.env`

```env
GITHUB_TOKEN=
GROQ_API_KEY=
ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

Frontend: `frontend/.env`

```env
VITE_API_BASE_URL=http://localhost:8000
```

Notes:

- `GITHUB_TOKEN` is optional and only increases GitHub API rate limits.
- `GROQ_API_KEY` is optional and only enables LLM-enhanced language fields.
- If the backend falls back to port `8010`, the frontend automatically tries `8010` when `VITE_API_BASE_URL` is not set.
- If you explicitly set `VITE_API_BASE_URL`, make sure it matches the backend port.

## Backend Setup

Recommended run from `backend`:

```powershell
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Direct run from `backend/app` is also supported:

```powershell
cd backend\app
python main.py
```

When `python main.py` is used, the backend tries port `8000` first and falls back to `8010`, `8011`, `8012`, or `8020` if Windows blocks a port.

Health check:

```text
http://localhost:8000/health
```

Interactive API docs:

```text
http://localhost:8000/docs
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

If the browser shows a stale blank screen during development, hard refresh with `Ctrl + Shift + R`.

## API Reference

### GET `/health`

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

Response includes repository name, aggregate stats, and analyzed pull requests with summaries, explanations, changed files, difficulty, learning tags, checklist items, review comments, risks, test/doc signals, and original GitHub links.

## Example Repositories To Test

- https://github.com/fastapi/fastapi
- https://github.com/langchain-ai/langchain
- https://github.com/huggingface/transformers
- https://github.com/vercel/next.js

## Screenshots

Add screenshots to the `screenshots/` folder after running the app locally. Suggested captures:

- Repository analysis form
- PR dashboard with stats cards
- PR detail card in dark mode
- Error state for invalid repository URLs

The `screenshots/.gitkeep` file only keeps the empty folder in Git. It can be removed after real screenshots are added.

## Developer Program Relevance

PR Mentor AI is a developer tool built on top of the GitHub REST API. It fetches pull requests, analyzes changed files, and provides AI-assisted review guidance for contributors and maintainers. It is designed as a GitHub API integration for improving open-source contribution workflows.

## Security Notes

- `.env` files are ignored by Git.
- Never commit `GITHUB_TOKEN` or `GROQ_API_KEY`.
- Backend secrets are never sent to the frontend.
- Public repositories work without a GitHub token.
- Private repositories should only be accessed when a properly scoped backend token is configured.
- Optional Groq requests are made from the backend only.

## Future Improvements

- Add GitHub OAuth for authenticated user workflows.
- Include PR comments and review discussion context in the analysis.
- Add issue-to-PR linking for richer contribution context.
- Export review reports as Markdown.
- Add repository history trends for maintainer dashboards.
- Cache GitHub responses to reduce rate-limit pressure.
- Add automated tests for analyzer edge cases and API error handling.
