from rest_framework import generics, permissions

from rest_framework.parsers import (
    MultiPartParser,
    FormParser
)

from .models import Post
from .permissions import IsOwnerOrReadOnly
from .serializers import (
    PostSerializer,
    PostCreateUpdateSerializer
)


class PostListCreateView(
    generics.ListCreateAPIView
):
    queryset = Post.objects.select_related(
        'author'
    ).all().order_by('-created_at')

    permission_classes = (
        permissions.IsAuthenticated,
    )

    parser_classes = (
        MultiPartParser,
        FormParser
    )

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return PostCreateUpdateSerializer

        return PostSerializer

    def perform_create(self, serializer):
        serializer.save(
            author=self.request.user
        )

    def create(self, request, *args, **kwargs):
        response = super().create(
            request,
            *args,
            **kwargs
        )

        post = Post.objects.select_related(
            'author'
        ).get(
            pk=response.data['id']
        )

        response.data = PostSerializer(
            post,
            context={
                'request': request
            }
        ).data

        return response


class MyPostsListView(
    generics.ListAPIView
):
    serializer_class = PostSerializer

    permission_classes = (
        permissions.IsAuthenticated,
    )

    pagination_class = None

    def get_queryset(self):
        return Post.objects.select_related(
            'author'
        ).filter(
            author=self.request.user
        ).order_by(
            '-created_at'
        )


class PostRetrieveUpdateDestroyView(
    generics.RetrieveUpdateDestroyAPIView
):
    queryset = Post.objects.select_related(
        'author'
    ).all()

    permission_classes = (
        permissions.IsAuthenticated,
        IsOwnerOrReadOnly
    )

    parser_classes = (
        MultiPartParser,
        FormParser
    )

    def get_serializer_class(self):
        if self.request.method in (
            'PUT',
            'PATCH'
        ):
            return PostCreateUpdateSerializer

        return PostSerializer

    def update(self, request, *args, **kwargs):
        response = super().update(
            request,
            *args,
            **kwargs
        )

        post = Post.objects.select_related(
            'author'
        ).get(
            pk=kwargs['pk']
        )

        response.data = PostSerializer(
            post,
            context={
                'request': request
            }
        ).data

        return response