from __future__ import annotations

from django.core.management.base import BaseCommand

from movies.models import Movie

SEED_MOVIES = [
    {
        "id": "5b4dc6f2-06b4-4d2f-bb34-7305cf0df4df",
        "name": "Inception",
        "description": (
            "Un voleur spécialisé dans l'extraction de rêves se voit confier une mission"
            " presque impossible : implanter une idée dans l'esprit de sa cible."
        ),
    },
    {
        "id": "cf48a75a-56d7-4c77-9a8e-5fb5396ac7cc",
        "name": "Interstellar",
        "description": (
            "Un ancien pilote de la NASA mène une expédition à travers un trou de ver pour"
            " trouver une nouvelle planète habitable et sauver l'humanité."
        ),
    },
    {
        "id": "6f79de8d-8a89-4b48-9dd6-527969b5cb1c",
        "name": "The Dark Knight",
        "description": (
            "Batman affronte le Joker, un criminel prêt à plonger Gotham dans le chaos"
            " pour mettre à l'épreuve la morale de ses habitants."
        ),
    },
    {
        "id": "20cdb406-a148-430b-8edf-d3da9048c117",
        "name": "Fight Club",
        "description": (
            "Un employé insomniaque rencontre un vendeur de savon charismatique avec qui"
            " il fonde un club de combat clandestin."
        ),
    },
    {
        "id": "06a68f8b-0939-4cab-9b22-321f661d6d76",
        "name": "Forrest Gump",
        "description": (
            "Le récit de la vie extraordinaire d'un homme simple qui traverse les grands"
            " événements de l'histoire américaine."
        ),
    },
]


class Command(BaseCommand):
    help = "Seed default movies so the API is never empty on first run"

    def handle(self, *args, **options):  # noqa: D401
        created = 0

        for payload in SEED_MOVIES:
            movie_id = payload["id"]
            defaults = {key: value for key, value in payload.items() if key != "id"}

            _, was_created = Movie.objects.update_or_create(
                id=movie_id,
                defaults=defaults,
            )

            if was_created:
                created += 1

        updated = len(SEED_MOVIES) - created
        self.stdout.write(
            self.style.SUCCESS(
                f"Seeded {len(SEED_MOVIES)} movies ({created} created, {updated} updated)."
            )
        )
