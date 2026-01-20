# CineDock

Backend + frontend boilerplate for managing a movie catalog with authenticated users.

## Tech Stack

- Django 6 / Django REST Framework
- Token authentication (rest_framework.authtoken)
- drf-spectacular for automatic API documentation
- Docker (backend + frontend services)

## Prerequisites

- Python 3.11+
- Node.js 18+ (for the frontend)
- Docker / Docker Compose (recommended path)

## Quick Start (Docker)

```bash
# Start all services (backend, frontend, db if configured)
docker compose up --build

# Create Django superuser inside backend container
docker compose exec backend python manage.py createsuperuser
```

The backend will be available on `http://localhost:8000`, the Vite frontend on `http://localhost:5173`.

## Manual Backend Setup

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser  # optional
python manage.py runserver 0.0.0.0:8000
```

Configure `DATABASE_URL` if you want to point to PostgreSQL; SQLite is used by default.

## Running Tests

```bash
# Run Django unit tests
python manage.py test movies users -v 2

# Via Docker container
docker compose exec backend python manage.py test -v 2
```

## API Documentation

Automatic OpenAPI schema + interactive docs are exposed once the backend is running:

- Raw schema: `GET http://localhost:8000/api/schema/`
- Swagger UI: `http://localhost:8000/api/docs/`
- ReDoc: `http://localhost:8000/api/redoc/`

## Useful Backend Commands

```bash
# Create new app
python manage.py startapp my_app

# Make database migrations
python manage.py makemigrations
python manage.py migrate

# Collect static files (prod)
python manage.py collectstatic
```

## Directory Highlights

- `backend/movies/` – Movie catalog models, serializers, views, tests
- `backend/users/` – Auth endpoints (register/login/me)
- `frontend/` – Vite/React client (placeholder)

Feel free to adapt this README as the project evolves (e.g., deployment, CI/CD, environment variables).
