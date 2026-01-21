import uuid

from django.conf import settings
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models


class Movie(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to="movies/", blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return self.name


class MovieReview(models.Model):
    movie = models.ForeignKey(
        Movie,
        related_name="reviews",
        on_delete=models.CASCADE,
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="movie_reviews",
        on_delete=models.CASCADE,
    )
    rating = models.DecimalField(
        max_digits=2,
        decimal_places=1,
        validators=[MinValueValidator(0), MaxValueValidator(5)],
    )
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-updated_at"]
        constraints = [
            models.UniqueConstraint(
                fields=["movie", "user"], name="unique_movie_review"
            ),
        ]

    def __str__(self) -> str:  # pragma: no cover - readable admin representation
        return f"{self.user} → {self.movie} ({self.rating}/5)"
