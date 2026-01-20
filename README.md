# CineDock

Backend + frontend boilerplate for managing a movie catalog with authenticated users.

## Tech Stack

- Django 6 / Django REST Framework
- Token authentication (rest_framework.authtoken)
- drf-spectacular for automatic API documentation
- Docker (backend + frontend services)


## Quick Start (Docker)

```bash
# Start all services (backend, frontend, db if configured)
docker compose up --build

# Create Django superuser inside backend container
docker compose exec backend python manage.py createsuperuser
```

The backend will be available on `http://localhost:8000`, the Vite frontend on `http://localhost:5173`.


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

