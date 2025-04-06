from django.urls import path
from .views import SubscribedUsersView, CreateOrGetChatView, ChatMessagesView, SendMessageView, RecentChatsView

urlpatterns = [
    path('subscribed-users/', SubscribedUsersView.as_view()),
    path('chat/create/', CreateOrGetChatView.as_view()),
    path('chat/recent/', RecentChatsView.as_view()),
    path('chat/messages/<int:chat_id>/', ChatMessagesView.as_view()),
    path('chat/send/', SendMessageView.as_view()),
]
