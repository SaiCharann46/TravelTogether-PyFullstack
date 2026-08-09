from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import TravelGroup, ChatMessage, OTP

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'id_proof_type', 'is_verified']
        read_only_fields = ['id', 'is_verified']


class SignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    confirm_password = serializers.CharField(write_only=True, min_length=6)
    otp_code = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'confirm_password', 
                  'id_proof_type', 'id_proof_number', 'otp_code']

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError("Passwords do not match.")
        return data

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        otp_code = validated_data.pop('otp_code', None)
        
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            id_proof_type=validated_data.get('id_proof_type', ''),
            id_proof_number=validated_data.get('id_proof_number', ''),
        )
        return user


class TravelGroupSerializer(serializers.ModelSerializer):
    member_count = serializers.SerializerMethodField()
    owner_username = serializers.SerializerMethodField()

    class Meta:
        model = TravelGroup
        fields = ['id', 'group_name', 'group_description', 'group_code', 
                  'owner', 'owner_username', 'member_count', 'created_at']
        read_only_fields = ['group_code', 'owner', 'created_at']

    def get_member_count(self, obj):
        return obj.get_member_count()

    def get_owner_username(self, obj):
        return obj.owner.username


class ChatMessageSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField()

    class Meta:
        model = ChatMessage
        fields = ['id', 'group', 'user', 'username', 'message', 'timestamp']
        read_only_fields = ['user', 'timestamp']

    def get_username(self, obj):
        return obj.user.username


class OTPSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp_code = serializers.CharField(max_length=6, required=False)
