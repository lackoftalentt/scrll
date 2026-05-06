from rest_framework import serializers
from .models import Like

class LikeSerializer(serializers.ModelSerializer):
    user = serializers.SlugRelatedField(slug_field='username', read_only=True)

    class Meta:
        model = Like
        fields = ('id', 'user', 'post', 'created_at')
        read_only_fields = ('id', 'user', 'created_at')

class LikeToggleSerializer(serializers.Serializer):
    liked = serializers.BooleanField(read_only=True)
    likes_count = serializers.IntegerField(read_only=True)