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

Direct run from `backend/app` is also supported:

```powershell
cd app
python main.py
```

Direct run tries port `8000` first and falls back to `8010`, `8011`, `8012`, or `8020` if needed.

## Environment

Use `backend/.env` for local backend configuration.

- `GITHUB_TOKEN` is optional and increases GitHub API rate limits.
- `GROQ_API_KEY` is optional and enables LLM-enhanced summaries.
- `ALLOWED_ORIGINS` controls browser origins allowed by CORS. Include both `localhost` and `127.0.0.1` if you use both browser URLs.

Secrets stay on the backend and are never sent to the frontend.
