from django.contrib import admin
from .models import Profile, Subscription

# Register your models here.
admin.site.register([Profile, Subscription])
