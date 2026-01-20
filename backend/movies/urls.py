from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import MovieReviewListCreateView, MovieViewSet, health


# English comments only
router = DefaultRouter()
router.register(r"movies", MovieViewSet, basename="movie")

urlpatterns = [
    path("health/", health),
    path(
        "movies/<uuid:movie_id>/reviews/",
        MovieReviewListCreateView.as_view(),
        name="movie-reviews",
    ),
    path("", include(router.urls)),
]
