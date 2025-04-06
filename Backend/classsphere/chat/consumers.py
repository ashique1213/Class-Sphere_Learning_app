import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import AccessToken
from .models import Chat
from authentication.models import User


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.chat_id = self.scope['url_route']['kwargs']['chat_id']
        self.room_group_name = f'chat_{self.chat_id}'

        # Authenticate user from token
        token = self.scope['query_string'].decode().split('token=')[-1]
        try:
            access_token = AccessToken(token)
            user_id = access_token['user_id']
            self.user = await database_sync_to_async(User.objects.get)(id=user_id)
            self.chat = await database_sync_to_async(Chat.objects.get)(id=self.chat_id)

            if not await database_sync_to_async(self.chat.participants.filter(id=user_id).exists)():
                await self.close()
                return
        except Exception as e:
            print(f"Authentication error: {e}")
            await self.close()
            return

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data.get('message')
        if not message:
            return
        message_id = data.get('id', '')
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'sender': self.user.username,
                'timestamp': data.get('timestamp', ''),
                'id': message_id,
            }
        )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            'message': event['message'],
            'sender': event['sender'],
            'timestamp': event['timestamp'],
        }))