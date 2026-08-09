from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
from datetime import timedelta
import random
import string


# Custom User Model
class User(AbstractUser):
    id_proof_type = models.CharField(max_length=50, blank=True)
    id_proof_number = models.CharField(max_length=100, blank=True)
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.username


# OTP Model for Email Verification
class OTP(models.Model):
    email = models.EmailField()
    otp_code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    is_used = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.email} - {self.otp_code}"

    def is_expired(self):
        """Check if OTP has expired (10 minutes)"""
        expiry_time = self.created_at + timedelta(minutes=10)
        return timezone.now() > expiry_time

    @staticmethod
    def generate_otp():
        """Generate a 6-digit OTP"""
        return ''.join(random.choices(string.digits, k=6))


# Travel Group Model
class TravelGroup(models.Model):
    group_name = models.CharField(max_length=200)
    group_description = models.TextField()
    group_code = models.CharField(max_length=6, unique=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='owned_groups')
    members = models.ManyToManyField(User, related_name='joined_groups', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.group_name

    def get_member_count(self):
        """Get total number of members including owner"""
        return self.members.count() + 1  # +1 for owner

    @staticmethod
    def generate_group_code():
        """Generate a unique 6-digit group code"""
        while True:
            code = ''.join(random.choices(string.digits, k=6))
            if not TravelGroup.objects.filter(group_code=code).exists():
                return code


# Chat Message Model
class ChatMessage(models.Model):
    group = models.ForeignKey(TravelGroup, on_delete=models.CASCADE, related_name='messages')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='messages')
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} in {self.group.group_name}: {self.message[:50]}"

    class Meta:
        ordering = ['timestamp']
