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
from classroom.models import Classroom, Student


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
                "id": message.id,
            }
        )
        return Response(serializer.data, status=status.HTTP_201_CREATED)
 
class SubscribedUsersView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        response_data = {}

        user_role = getattr(user, 'role', None) 

        if user_role == "student":
            try:
                student_profile = Student.objects.get(user=user)
                joined_classes = student_profile.joined_classes.all()

                # Get teachers of joined classes with subscription status
                teachers = User.objects.filter(classrooms__in=joined_classes).distinct()
                response_data["teachers"] = [
                    {
                        "id": t.id,
                        "username": t.username,
                        "is_subscribed": t.subscriptions.filter(
                            is_active=True,
                            end_date__gte=timezone.now()
                        ).exclude(plan__name__iexact="free").exists()
                    }
                    for t in teachers
                ]

                # Get fellow students
                fellow_students = User.objects.filter(
                    student__joined_classes__in=joined_classes
                ).exclude(id=user.id).distinct()
                response_data["fellow_students"] = [
                    {"id": s.id, "username": s.username} for s in fellow_students
                ]

            except Student.DoesNotExist:
                response_data["teachers"] = []
                response_data["fellow_students"] = []

        elif user_role == "teacher":
            # Get all classes created by the teacher
            created_classes = Classroom.objects.filter(teacher=user)
            if created_classes.exists():
                # Get all students 
                students_in_classes = User.objects.filter(
                    student__joined_classes__in=created_classes
                ).distinct()
                response_data["students_in_my_classes"] = [
                    {"id": s.id, "username": s.username} for s in students_in_classes
                ]
            else:
                response_data["students_in_my_classes"] = []

        else:
            # where role is undefined or invalid
            response_data["message"] = "User role not defined or invalid."

        return Response(response_data)
    
class CreateOrGetChatView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        other_user_id = request.data.get("user_id")
        if not other_user_id:
            return Response({"error": "User ID is required"}, status=status.HTTP_400_BAD_REQUEST)

        other_user = get_object_or_404(User, id=other_user_id)
        if other_user == request.user:
            return Response({"error": "Cannot chat with yourself"}, status=status.HTTP_400_BAD_REQUEST)

        has_paid_subscription = UserSubscription.objects.filter(
            user=other_user, is_active=True, end_date__gte=timezone.now()
        ).exclude(plan__name__iexact="free").exists()
        if not has_paid_subscription:
            return Response({"error": "User does not have an active paid subscription"}, status=status.HTTP_403_FORBIDDEN)

        chat = Chat.objects.filter(participants=request.user).filter(participants=other_user).first()
        if not chat:
            chat = Chat.objects.create()
            chat.participants.add(request.user, other_user)

        serializer = ChatSerializer(chat, context={"request": request})
        return Response(serializer.data, status=status.HTTP_201_CREATED)