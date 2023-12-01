import os
from celery import Celery

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'p2phelper.settings')
app = Celery('p2phelper_tasks')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()

app.conf.enable_utc = False
