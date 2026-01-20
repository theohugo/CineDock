#!/bin/bash
set -o errexit
set -o pipefail
set -o nounset

python manage.py migrate --noinput
python manage.py seed_movies

if [[ "${DJANGO_COLLECTSTATIC:-0}" == "1" ]]; then
    python manage.py collectstatic --noinput
fi

exec "$@"
