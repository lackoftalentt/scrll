from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from posts.models import Post
from .models import Like
from .serializers import LikeToggleSerializer

class LikeToggleView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, post_pk):
        post = Post.objects.get(pk=post_pk)
        like, created = Like.objects.get_or_create(user=request.user, post=post)

        if not created:
            like.delete()
            liked = False
        else:
            liked = True

        serializer = LikeToggleSerializer({
            'liked': liked,
            'likes_count': post.likes.count(),
        })
        status_code = status.HTTP_201_CREATED if liked else status.HTTP_200_OK
        return Response(serializer.data, status=status_code)