import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
# 
class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        from rest_framework_simplejwt.tokens import AccessToken
        from .models import Chat, Message
        from authentication.models import User
        self.chat_id = self.scope['url_route']['kwargs']['chat_id']
        self.room_group_name = f'chat_{self.chat_id}'

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
        media_url = data.get('media_url')
        media_type = data.get('media_type')
        message_id = data.get('id', '')

        # Save the message to the database (if not already saved by the API)
        if message or media_url:
            await self.save_message(message, media_url, media_type, message_id)

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'sender': self.user.username,
                'media_url': media_url,
                'media_type': media_type,
                'timestamp': data.get('timestamp', ''),
                'id': message_id,
            }
        )

    @database_sync_to_async
    def save_message(self, message, media_url, media_type, message_id):
        from .models import Chat, Message
        if not message_id:  # Only save if not already saved by API
            chat = Chat.objects.get(id=self.chat_id)
            msg = Message.objects.create(
                chat=chat,
                sender=self.user,
                text=message,
                media=media_url, 
                media_type=media_type
            )
            return str(msg.id)
        return message_id

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            'id': str(event['id']),
            'sender': event['sender'],
            'text': event['message'],
            'media_url': event['media_url'],
            'media_type': event['media_type'],
            'timestamp': event['timestamp'],

        }))