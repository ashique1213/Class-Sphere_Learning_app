# notifications/consumers.py
import json
import logging
from urllib.parse import parse_qs
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async

logger = logging.getLogger(__name__)

class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Get token from query string
        query_string = self.scope['query_string'].decode()
        query_params = parse_qs(query_string)
        token = query_params.get('token', [None])[0]

        if not token:
            await self.close()
            return

        # Validate token and get user
        user = await self.get_user_from_token(token)
        if not user or user.is_anonymous:
            await self.close()
            return

        self.scope['user'] = user
        self.group_name = f"user_{self.scope['user'].id}"
        logger.info(f"WebSocket connected for {self.group_name}")
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        if hasattr(self, 'group_name'):
            logger.info(f"WebSocket disconnected for {self.group_name}")
            await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def send_notification(self, event):
        logger.info(f"Sending notification to {self.group_name}: {event['id']}")
        await self.send(text_data=json.dumps({
            'id': event['id'],
            'message': event['message'],
            'notification_type': event['notification_type'],
            'time_ago': event['time_ago'],
            'is_read': event['is_read'],
        }))

    @database_sync_to_async
    def get_user_from_token(self, token):
        from rest_framework_simplejwt.tokens import AccessToken
        from authentication.models import User
        try:
            access_token = AccessToken(token)
            user_id = access_token['user_id']
            return User.objects.get(id=user_id)
        except Exception as e:
            logger.error(f"Token validation error in NotificationConsumer: {e}")
            return None