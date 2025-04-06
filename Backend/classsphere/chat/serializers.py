from rest_framework import serializers
from .models import Chat, Message

# serializers.py
class MessageSerializer(serializers.ModelSerializer):
    sender = serializers.CharField(source="sender.username")
    timestamp = serializers.DateTimeField(format="%Y-%m-%dT%H:%M:%S.%fZ")

    class Meta:
        model = Message
        fields = ["id", "sender", "text", "timestamp"]

class ChatSerializer(serializers.ModelSerializer):
    last_message = serializers.SerializerMethodField()

    class Meta:
        model = Chat
        fields = ["id", "name", "last_message"]

    def get_last_message(self, obj):
        last_msg = obj.messages.order_by('-timestamp').first()
        return MessageSerializer(last_msg).data if last_msg else None