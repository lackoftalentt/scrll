from rest_framework import generics, permissions
from rest_framework.response import Response

from .models import Comment
from .permissions import IsCommentOwner
from .serializers import (
    CommentSerializer,
    CommentCreateSerializer,
    CommentUpdateSerializer
)

class CommentListCreateView(generics.ListCreateAPIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return Comment.objects.select_related(
            'author',
            'post'
        ).filter(
            post_id=self.kwargs['post_pk']
        )

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return CommentCreateSerializer

        return CommentSerializer

    def perform_create(self, serializer):
        serializer.save(
            author=self.request.user,
            post_id=self.kwargs['post_pk']
        )

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)

        comment = Comment.objects.select_related(
            'author',
            'post'
        ).get(
            pk=response.data['id']
        )

        response.data = CommentSerializer(comment).data

        return response


class CommentUpdateView(generics.UpdateAPIView):
    queryset = Comment.objects.select_related(
        'author',
        'post'
    ).all()

    permission_classes = (
        permissions.IsAuthenticated,
        IsCommentOwner
    )

    serializer_class = CommentUpdateSerializer

    http_method_names = ['patch']

    def update(self, request, *args, **kwargs):
        super().update(request, *args, **kwargs)

        comment = self.get_object()

        return Response(
            CommentSerializer(comment).data
        )


class CommentDestroyView(generics.DestroyAPIView):
    queryset = Comment.objects.select_related(
        'author'
    ).all()

    permission_classes = (
        permissions.IsAuthenticated,
        IsCommentOwner
    )

    serializer_class = CommentSerializer