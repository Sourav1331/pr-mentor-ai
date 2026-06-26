# PR Mentor AI Frontend

React + Vite frontend for PR Mentor AI. It provides a GitHub-style dashboard for analyzing open pull requests from public repositories.

## Setup

```powershell
npm install
npm run dev
```

The frontend runs at:

```text
http://localhost:5173
```

## Environment

Use `frontend/.env` if you need to force a backend URL:

```env
VITE_API_BASE_URL=http://localhost:8000
```

If `VITE_API_BASE_URL` is not set, the frontend tries local backend URLs on `8000` and `8010` automatically.

## Notes

- Backend secrets are never stored in the frontend.
- If the page appears stale during development, hard refresh with `Ctrl + Shift + R`.
