from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import MovieViewSet, health


# English comments only
router = DefaultRouter()
router.register(r"movies", MovieViewSet, basename="movie")

urlpatterns = [
    path("health/", health),
    path("", include(router.urls)),
]
