import os
from celery import Celery

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'classsphere.settings')

app = Celery('classsphere')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()

print(f"Broker URL in Celery: {app.conf.broker_url}")  # Debug