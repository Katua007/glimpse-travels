# Glimpse Travels

A travel journal app. Users sign up, log trips with dates and destinations, attach photos, and follow trips other travelers have shared.

## Stack

**Frontend** — React 18 (Create React App), React Router v6, Formik + Yup for forms, framer-motion for animation, lucide-react for icons.

**Backend** — Flask, Flask-RESTful, Flask-SQLAlchemy, Flask-Migrate, Flask-Bcrypt, flask-jwt-extended. SQLite locally, Postgres in production.

## Local setup

### Backend

```bash
cd server
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

cp ../.env.example .env   # then edit values as needed
flask db upgrade          # create/update tables
python seed.py            # optional: load sample data
flask run -p 5555
```

The API serves at `http://localhost:5555`.

### Frontend

```bash
npm install
cp .env.example .env   # REACT_APP_API_URL defaults to http://localhost:5555 if omitted
npm start
```

The app serves at `http://localhost:3000`.

### Tests

```bash
npm test                    # frontend
cd server && pytest         # backend
```

## Environment variables

See [.env.example](.env.example) for the full list with descriptions:

| Variable | Used by | Purpose |
|---|---|---|
| `REACT_APP_API_URL` | frontend | Base URL of the Flask API |
| `SECRET_KEY` | backend | Signing key for JWTs |
| `DATABASE_URL` | backend | SQLAlchemy connection string (Postgres in production) |
| `CORS_ORIGINS` | backend | Comma-separated list of origins allowed to call the API |

## Seed data

`python server/seed.py` wipes and repopulates the database with sample users, trips, photos, and followers — every seeded user's password is `password`. It refuses to run against a non-empty database unless you pass `--force`.

## API reference

Base URL: `REACT_APP_API_URL` (e.g. `http://localhost:5555`). Authenticated routes expect `Authorization: Bearer <token>`.

| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/health` | — | Liveness check |
| POST | `/signup` | — | Create an account, returns a JWT |
| POST | `/login` | — | Authenticate, returns a JWT |
| DELETE | `/logout` | — | Stateless no-op for client symmetry |
| GET | `/check_session` | required | Return the current user from the token |
| GET | `/trips` | — | List all trips |
| POST | `/trips` | required | Create a trip owned by the caller |
| GET | `/trips/:id` | — | Get one trip with its photos and followers |
| PATCH | `/trips/:id` | required, owner | Update `title`, `destination`, `start_date`, `end_date` |
| DELETE | `/trips/:id` | required, owner | Delete a trip and its photos/followers |
| GET | `/users` | — | List users (paginated) |
| GET | `/users/:id` | — | Get one user |
| GET | `/users/:id/trips` | — | List a user's trips |
| POST | `/photos` | required, owner | Attach a photo to a trip the caller owns |
| GET | `/trip-followers` | — | List all trip-follower records |
| POST | `/trip-followers` | required | Follow a trip as the caller |
| DELETE | `/trip-followers/:user_id/:trip_id` | required, self | Unfollow a trip |

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md).
