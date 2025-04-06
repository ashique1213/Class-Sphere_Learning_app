from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from django.shortcuts import get_object_or_404
from subscription.models import UserSubscription
from .models import Chat, Message
from .serializers import ChatSerializer, MessageSerializer
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from authentication.models import User

class RecentChatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        chats = Chat.objects.filter(participants=request.user)
        serializer = ChatSerializer(chats, many=True, context={"request": request})
        return Response(serializer.data)

class ChatMessagesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, chat_id):
        chat = get_object_or_404(Chat, id=chat_id, participants=request.user)
        messages = chat.messages.order_by("timestamp")
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data)

class SendMessageView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        chat_id = request.data.get("chat_id")
        message_text = request.data.get("message")
        if not chat_id or not message_text:
            return Response({"error": "Chat ID and message are required"}, status=status.HTTP_400_BAD_REQUEST)

        chat = get_object_or_404(Chat, id=chat_id, participants=request.user)
        message = Message.objects.create(chat=chat, sender=request.user, text=message_text)
        serializer = MessageSerializer(message)

        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f"chat_{chat_id}",
            {
                "type": "chat_message",
                "chat_id": chat_id,
                "sender": request.user.username,
                "message": message_text,
                "timestamp": message.timestamp.isoformat(),
                "id": message.id,  # Add message ID
            }
        )
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class SubscribedUsersView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        subscribed_users = User.objects.filter(
            subscriptions__is_active=True,
            subscriptions__end_date__gte=timezone.now()
        ).exclude(
            subscriptions__plan__name__iexact="free"
        ).exclude(id=request.user.id).distinct()

        return Response([{"id": user.id, "username": user.username} for user in subscribed_users])

class CreateOrGetChatView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        other_user_id = request.data.get("user_id")
        if not other_user_id:
            return Response({"error": "User ID is required"}, status=status.HTTP_400_BAD_REQUEST)

        other_user = get_object_or_404(User, id=other_user_id)
        if other_user == request.user:
            return Response({"error": "Cannot chat with yourself"}, status=status.HTTP_400_BAD_REQUEST)

        # Check if other user has a paid subscription
        has_paid_subscription = UserSubscription.objects.filter(
            user=other_user, is_active=True, end_date__gte=timezone.now()
        ).exclude(plan__name__iexact="free").exists()
        if not has_paid_subscription:
            return Response({"error": "User does not have an active paid subscription"}, status=status.HTTP_403_FORBIDDEN)

        chat = Chat.objects.filter(participants=request.user).filter(participants=other_user).first()
        if not chat:
            chat = Chat.objects.create(name=f"{request.user.username} - {other_user.username}")
            chat.participants.add(request.user, other_user)

        return Response({"id": chat.id, "name": chat.name}, status=status.HTTP_201_CREATED)