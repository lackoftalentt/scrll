from rest_framework import generics, permissions
from .models import Post
from .permissions import IsOwnerOrReadOnly
from .serializers import PostSerializer, PostCreateUpdateSerializer

class PostListCreateView(generics.ListCreateAPIView):
    queryset = Post.objects.select_related('author').all()
    permission_classes = (permissions.IsAuthenticated,)

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return PostCreateUpdateSerializer
        return PostSerializer

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        post = Post.objects.get(pk=response.data['id'])
        response.data = PostSerializer(post).data
        return response

class PostRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Post.objects.select_related('author').all()
    permission_classes = (permissions.IsAuthenticated, IsOwnerOrReadOnly)

    def get_serializer_class(self):
        if self.request.method in ('PUT', 'PATCH'):
            return PostCreateUpdateSerializer
        return PostSerializer

    def update(self, request, *args, **kwargs):
        response = super().update(request, *args, **kwargs)
        post = Post.objects.get(pk=kwargs['pk'])
        response.data = PostSerializer(post).data
        return response