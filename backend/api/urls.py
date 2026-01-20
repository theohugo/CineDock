from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import health, MovieViewSet


# English comments only
router = DefaultRouter()
router.register(r"movies", MovieViewSet, basename="movie")

urlpatterns = [
    path("health/", health),
    path("", include(router.urls)),
]
