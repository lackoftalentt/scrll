from rest_framework import serializers

from .models import Post


class PostSerializer(serializers.ModelSerializer):
    author = serializers.SlugRelatedField(
        slug_field='username',
        read_only=True
    )

    likes_count = serializers.IntegerField(
        read_only=True
    )

    comments_count = serializers.IntegerField(
        read_only=True
    )

    is_liked = serializers.SerializerMethodField()

    is_owner = serializers.SerializerMethodField()

    class Meta:
        model = Post

        fields = (
            'id',
            'author',
            'content',
            'image',
            'likes_count',
            'comments_count',
            'is_liked',
            'is_owner',
            'created_at'
        )

        read_only_fields = (
            'id',
            'author',
            'likes_count',
            'comments_count',
            'is_liked',
            'is_owner',
            'created_at'
        )

    def get_is_liked(self, obj):
        request = self.context.get('request')

        if not request or not request.user.is_authenticated:
            return False

        return obj.likes.filter(
            user=request.user
        ).exists()

    def get_is_owner(self, obj):
        request = self.context.get('request')

        if not request or not request.user.is_authenticated:
            return False

        return obj.author_id == request.user.id
    

class PostCreateUpdateSerializer(
    serializers.ModelSerializer
):
    class Meta:
        model = Post

        fields = (
            'id',
            'content',
            'image'
        )