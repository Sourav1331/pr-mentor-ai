# PR Mentor AI Backend

FastAPI backend for PR Mentor AI. It validates GitHub repository URLs, calls the GitHub REST API, analyzes pull request changes, and optionally improves selected text fields with Groq when `GROQ_API_KEY` is configured.

## Setup

```powershell
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Direct run from `backend/app` is also supported:

```powershell
cd app
python main.py
```

Direct run tries port `8000` first and falls back to `8010`, `8011`, `8012`, or `8020` if needed.

## Environment

Use `backend/.env` for local backend configuration:

```env
GITHUB_TOKEN=
GROQ_API_KEY=
ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

- `GITHUB_TOKEN` is optional and increases GitHub API rate limits.
- `GROQ_API_KEY` is optional and enables LLM-enhanced summaries, explanations, review comments, and risks.
- `ALLOWED_ORIGINS` controls browser origins allowed by CORS.

Secrets stay on the backend and are never sent to the frontend.

## Endpoints

- `GET /health`
- `POST /analyze-prs`
- `GET /docs`

The API normally runs at `http://localhost:8000`.
