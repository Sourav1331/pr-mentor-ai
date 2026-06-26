# PR Mentor AI Backend

FastAPI backend for PR Mentor AI. It integrates with the GitHub REST API to fetch open pull requests, PR details, and changed files for public repositories.

## Setup

```powershell
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

The API runs at `http://localhost:8000`.

## Environment

Copy `.env.example` to `.env`.

- `GITHUB_TOKEN` is optional and increases GitHub API rate limits.
- `GROQ_API_KEY` is optional and enables LLM-enhanced summaries.
- `ALLOWED_ORIGINS` controls browser origins allowed by CORS.

Secrets stay on the backend and are never sent to the frontend.
