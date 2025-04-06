# serializers.py
from rest_framework import serializers
from .models import Chat, Message

class MessageSerializer(serializers.ModelSerializer):
    sender = serializers.CharField(source="sender.username")

    class Meta:
        model = Message
        fields = ["id", "sender", "text", "timestamp"]

class ChatSerializer(serializers.ModelSerializer):
    other_user = serializers.SerializerMethodField()
    last_message = serializers.SerializerMethodField()

    class Meta:
        model = Chat
        fields = ["id", "other_user", "last_message"]

    def get_other_user(self, obj):
        other_user = obj.get_other_participant(self.context["request"].user)
        return {"id": other_user.id, "username": other_user.username} if other_user else None

    def get_last_message(self, obj):
        last_msg = obj.messages.order_by("-timestamp").first()
        return MessageSerializer(last_msg).data if last_msg else None