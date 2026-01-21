# CineDock

Movie catalog backend (Django REST Framework) + placeholder Vite frontend, both wired through Docker.

## Tech Stack

- Django 6, DRF, Token auth
- drf-spectacular for OpenAPI + Swagger/ReDoc
- PostgreSQL 16 (via Docker) or SQLite locally
- Gunicorn application server

## Prerequisites

- Docker Desktop 4.x+ (Docker Compose v2)
- Optional: Python 3.11+ and Node 18+ if you want to run services outside Docker

## Docker Workflow

```bash
# 0. Configure environment
cp .env.example .env  # then edit values as needed

# 1. Build images (installs Python deps, prepares DB image)
docker compose build

# 2. Start stack (backend runs migrations automatically via entrypoint)
docker compose up

# 3. Follow logs
docker compose logs -f backend

# 4. Run admin commands (createsuperuser, shell, etc.)
docker compose exec backend python manage.py createsuperuser
```

The backend listens on `http://localhost:8000` and connects to the `db` container through the `DATABASE_URL` defined in `.env`. The PostgreSQL container exposes `5432` for optional local access.

### Useful Environment Overrides

Set these before `docker compose up` (e.g., in PowerShell `$env:DJANGO_DEBUG=0`):

- `DJANGO_SECRET_KEY` – overrides the dev key
- `DJANGO_DEBUG=0` – disables Django debug mode
- `DJANGO_COLLECTSTATIC=1` – runs `collectstatic` during startup

## API Documentation

Once the backend is running:

- Swagger UI: <http://localhost:8000/api/docs/>
- ReDoc: <http://localhost:8000/api/redoc/>
- Raw schema: <http://localhost:8000/api/schema/>



Configure `DATABASE_URL` to point at PostgreSQL if you do not want the default SQLite database.

## Running Tests

```bash
# Local virtualenv
python manage.py test movies users -v 2

# Inside Docker
docker compose exec backend python manage.py test -v 2
```

## Directory Highlights

- `backend/movies/` – movie CRUD API (model, serializer, viewset, tests)
- `backend/users/` – auth endpoints (register/login/me) + token issuance
- `frontend/` – placeholder Vite app (Dockerfile ready for future build)

## Common Management Commands

```bash
python manage.py makemigrations
python manage.py migrate
python manage.py collectstatic
python manage.py shell_plus  # if django-extensions installed later
```

