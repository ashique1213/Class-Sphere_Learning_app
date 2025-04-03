from rest_framework import serializers
from .models import Review

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['id', 'name', 'role', 'content', 'rating', 'created_at', 'is_approved']
        read_only_fields = ['created_at']