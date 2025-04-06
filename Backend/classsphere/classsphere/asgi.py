"""
ASGI config for classsphere project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/asgi/
"""

import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
import notifications.routing
import chat.routing  # Import chat routing

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'classsphere.settings')

# Combine WebSocket URL patterns from both notifications and chat
combined_websocket_urlpatterns = (
    notifications.routing.websocket_urlpatterns + 
    chat.routing.websocket_urlpatterns
)

application = ProtocolTypeRouter({
    "http": get_asgi_application(),  # Handles HTTP requests
    "websocket": AuthMiddlewareStack(
        URLRouter(combined_websocket_urlpatterns)  # Use combined patterns
    ),
})