# Deployment

## Why not Vercel for the backend

Flask + SQLite can't run correctly on Vercel's serverless functions: the filesystem is ephemeral, so a SQLite file (and anything seeded into it) is wiped on every cold start. The backend needs a long-running process and a real database. Deploy it to a host that runs Flask as a normal server — Render, Railway, or Fly all work; these instructions use Render.

## Backend (Render)

1. Create a new Render **Web Service** pointing at this repo, with root directory `server/`.
2. Build command: `pip install -r requirements.txt`
3. Start command: `gunicorn app:app`
4. Add a Render **PostgreSQL** instance and set `DATABASE_URL` to its connection string.
5. Set environment variables: `SECRET_KEY`, `DATABASE_URL`, `CORS_ORIGINS` (the deployed frontend origin, e.g. `https://glimpse-travels.vercel.app`).
6. After the first deploy, run migrations and seed data from the Render shell:
   ```bash
   flask db upgrade
   python seed.py
   ```

## Frontend (Vercel)

The root [vercel.json](vercel.json) rewrites all routes to `index.html` so React Router's client-side routing survives a hard refresh.

1. Create a new Vercel project pointing at this repo, with the root directory left at the repo root.
2. Build command: `npm run build`. Output directory: `build`.
3. Set the environment variable `REACT_APP_API_URL` to the deployed backend's URL.
4. Deploy.

## Environment variables

See [.env.example](.env.example) for the full list.
