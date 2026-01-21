from __future__ import annotations

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand

User = get_user_model()

DEFAULT_USERS = [
    {
        "username": "test",
        "email": "test@example.com",
        "first_name": "Test",
        "last_name": "User",
        "password": "test",
        "is_staff": False,
        "is_superuser": False,
    }
]


class Command(BaseCommand):
    help = "Seed deterministic user accounts for local development"

    def handle(self, *args, **options):  # noqa: D401
        created = 0

        for payload in DEFAULT_USERS:
            defaults = {
                key: value for key, value in payload.items() if key != "password"
            }
            password = payload["password"]

            user, was_created = User.objects.update_or_create(
                username=payload["username"], defaults=defaults
            )
            user.set_password(password)
            user.save()

            if was_created:
                created += 1

        updated = len(DEFAULT_USERS) - created
        self.stdout.write(
            self.style.SUCCESS(
                f"Seeded {len(DEFAULT_USERS)} users ({created} created, {updated} updated)."
            )
        )
