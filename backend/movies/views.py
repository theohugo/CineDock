from drf_spectacular.utils import extend_schema, inline_serializer
from rest_framework import permissions, serializers, viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Movie
from .serializers import MovieSerializer


@extend_schema(
    responses=inline_serializer(
        name="HealthResponse",
        fields={"status": serializers.CharField()},
    )
)
@api_view(["GET"])
def health(request):
    return Response({"status": "ok"})


class MovieViewSet(viewsets.ModelViewSet):
    queryset = Movie.objects.all().order_by("-created_at")
    serializer_class = MovieSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
