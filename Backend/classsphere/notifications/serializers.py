from rest_framework import serializers
from .models import Notification

class NotificationSerializer(serializers.ModelSerializer):
    time_ago = serializers.SerializerMethodField()

    class Meta:
        model = Notification
        fields = ['id', 'message', 'is_read', 'created_at', 'time_ago', 'type']

    def get_time_ago(self, obj):
        from django.utils.timesince import timesince
        return timesince(obj.created_at)