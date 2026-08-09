from django.contrib import admin
from .models import User, TravelGroup, ChatMessage, OTP

# Register models for Django admin
admin.site.register(User)
admin.site.register(TravelGroup)
admin.site.register(ChatMessage)
admin.site.register(OTP)
