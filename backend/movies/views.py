from django.db.models import Avg, Count
from django.shortcuts import get_object_or_404
from drf_spectacular.utils import extend_schema, inline_serializer
from rest_framework import permissions, serializers, status, viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Movie, MovieReview
from .serializers import MovieReviewSerializer, MovieSerializer


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
    queryset = (
        Movie.objects.all()
        .annotate(
            average_rating=Avg("reviews__rating"),
            reviews_count=Count("reviews", distinct=True),
        )
        .order_by("-created_at")
    )
    serializer_class = MovieSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class MovieReviewListCreateView(APIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_movie(self, movie_id):
        return get_object_or_404(Movie, pk=movie_id)

    def get(self, request, movie_id):
        movie = self.get_movie(movie_id)
        reviews = movie.reviews.select_related("user").all()
        serializer = MovieReviewSerializer(reviews, many=True)
        return Response({"results": serializer.data})

    def post(self, request, movie_id):
        if not request.user or not request.user.is_authenticated:
            return Response(
                {"detail": "Authentication required."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        movie = self.get_movie(movie_id)
        serializer = MovieReviewSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        review, created = MovieReview.objects.update_or_create(
            movie=movie,
            user=request.user,
            defaults=serializer.validated_data,
        )

        output = MovieReviewSerializer(review)
        return Response(
            output.data,
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK,
        )
