from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import check_password
from django.utils import timezone
from datetime import timedelta
from .models import TravelGroup, ChatMessage, OTP
from .serializers import (
    UserSerializer, SignupSerializer, TravelGroupSerializer, 
    ChatMessageSerializer, OTPSerializer
)

User = get_user_model()


# ==================== OTP Functions ====================

@api_view(['POST'])
@permission_classes([AllowAny])
def generate_otp(request):
    """Generate and send OTP to email"""
    email = request.data.get('email')
    
    if not email:
        return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Check if user already exists
    if User.objects.filter(email=email).exists():
        return Response({'error': 'User with this email already exists'}, 
                       status=status.HTTP_400_BAD_REQUEST)
    
    # Generate OTP
    otp_code = OTP.generate_otp()
    
    # Delete old OTPs for this email
    OTP.objects.filter(email=email, is_used=False).delete()
    
    # Create new OTP
    otp = OTP.objects.create(email=email, otp_code=otp_code)
    
    # In production, send email here
    # For now, we'll return it in response (for testing)
    print(f"OTP for {email}: {otp_code}")  # Remove in production
    
    return Response({
        'message': 'OTP generated successfully',
        'otp_code': otp_code  # Remove this in production, only for testing
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([AllowAny])
def verify_otp(request):
    """Verify OTP code"""
    email = request.data.get('email')
    otp_code = request.data.get('otp_code')
    
    if not email or not otp_code:
        return Response({'error': 'Email and OTP code are required'}, 
                       status=status.HTTP_400_BAD_REQUEST)
    
    try:
        otp = OTP.objects.get(email=email, otp_code=otp_code, is_used=False)
        
        if otp.is_expired():
            otp.delete()
            return Response({'error': 'OTP has expired'}, 
                           status=status.HTTP_400_BAD_REQUEST)
        
        # Mark OTP as used
        otp.is_used = True
        otp.save()
        
        return Response({'message': 'OTP verified successfully'}, 
                       status=status.HTTP_200_OK)
    
    except OTP.DoesNotExist:
        return Response({'error': 'Invalid OTP code'}, 
                       status=status.HTTP_400_BAD_REQUEST)


# ==================== Authentication ====================

@api_view(['POST'])
@permission_classes([AllowAny])
def signup(request):
    """Register a new user with OTP verification"""
    serializer = SignupSerializer(data=request.data)
    
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    # Verify OTP
    email = serializer.validated_data['email']
    otp_code = serializer.validated_data.get('otp_code')
    
    if not otp_code:
        return Response({'error': 'OTP code is required'}, 
                       status=status.HTTP_400_BAD_REQUEST)
    
    try:
        otp = OTP.objects.get(email=email, otp_code=otp_code, is_used=False)
        
        if otp.is_expired():
            return Response({'error': 'OTP has expired. Please request a new one'}, 
                           status=status.HTTP_400_BAD_REQUEST)
        
        # Mark OTP as used
        otp.is_used = True
        otp.save()
        
    except OTP.DoesNotExist:
        return Response({'error': 'Invalid OTP code'}, 
                       status=status.HTTP_400_BAD_REQUEST)
    
    # Create user
    user = serializer.save()
    user.is_verified = True
    user.save()
    
    return Response({
        'message': 'Sign up successful!',
        'user': UserSerializer(user).data
    }, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    """Login user"""
    email = request.data.get('email')
    password = request.data.get('password')
    
    if not email or not password:
        return Response({'error': 'Email and password are required'}, 
                       status=status.HTTP_400_BAD_REQUEST)
    
    try:
        user = User.objects.get(email=email)
        
        if not check_password(password, user.password):
            return Response({'error': 'Incorrect email or password'}, 
                           status=status.HTTP_401_UNAUTHORIZED)
        
        return Response({
            'message': 'Login successful!',
            'user': UserSerializer(user).data
        }, status=status.HTTP_200_OK)
    
    except User.DoesNotExist:
        return Response({'error': 'Incorrect email or password'}, 
                       status=status.HTTP_401_UNAUTHORIZED)


# ==================== Groups ====================

@api_view(['POST'])
@permission_classes([AllowAny])
def create_group(request):
    """Create a new travel group"""
    group_name = request.data.get('group_name')
    group_description = request.data.get('group_description')
    user_id = request.data.get('user_id')
    
    if not group_name or not group_description:
        return Response({'error': 'Group name and description are required'}, 
                       status=status.HTTP_400_BAD_REQUEST)
    
    try:
        owner = User.objects.get(id=user_id) if user_id else None
    except (User.DoesNotExist, ValueError, TypeError):
        owner = None

    # Require a valid authenticated user to create a group
    if not owner:
        return Response(
            {'error': 'A valid user_id is required to create a group.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Generate unique group code
    group_code = TravelGroup.generate_group_code()

    group = TravelGroup.objects.create(
        group_name=group_name,
        group_description=group_description,
        group_code=group_code,
        owner=owner
    )
    
    # Add owner to members
    if owner:
        group.members.add(owner)
    
    return Response({
        'message': 'Group created successfully!',
        'group': TravelGroupSerializer(group).data
    }, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([AllowAny])
def join_group(request):
    """Join an existing group"""
    group_name = request.data.get('group_name')
    group_code = request.data.get('group_code')
    user_id = request.data.get('user_id')
    
    if not group_name or not group_code:
        return Response({'error': 'Group name and code are required'}, 
                       status=status.HTTP_400_BAD_REQUEST)
    
    try:
        group = TravelGroup.objects.get(
            group_name__iexact=group_name,
            group_code=group_code
        )
    except TravelGroup.DoesNotExist:
        return Response({'error': 'Invalid group name or code. Please try again.'}, 
                       status=status.HTTP_404_NOT_FOUND)
    
    # Add user to members if provided
    if user_id:
        try:
            user = User.objects.get(id=user_id)
            if user not in group.members.all():
                group.members.add(user)
        except User.DoesNotExist:
            pass
    
    return Response({
        'message': 'Successfully joined group!',
        'group': TravelGroupSerializer(group).data
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([AllowAny])
def search_groups(request):
    """Search groups by destination"""
    destination = request.query_params.get('destination', '')
    
    if destination:
        groups = TravelGroup.objects.filter(
            group_name__icontains=destination
        ) | TravelGroup.objects.filter(
            group_description__icontains=destination
        )
    else:
        groups = TravelGroup.objects.all()
    
    results = []
    for group in groups:
        results.append({
            'name': group.group_name,
            'code': group.group_code,
            'description': group.group_description,
            'member_count': group.get_member_count()
        })
    
    return Response({'results': results}, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_group_details(request, group_id):
    """Get group details by ID or code"""
    try:
        group = TravelGroup.objects.get(id=group_id)
    except (TravelGroup.DoesNotExist, ValueError):
        try:
            group = TravelGroup.objects.get(group_code=group_id)
        except TravelGroup.DoesNotExist:
            return Response({'error': 'Group not found'},
                           status=status.HTTP_404_NOT_FOUND)
    
    return Response({'group': TravelGroupSerializer(group).data}, 
                   status=status.HTTP_200_OK)


# ==================== Chat ====================

@api_view(['POST'])
@permission_classes([AllowAny])
def send_message(request):
    """Send a message to a group"""
    group_id = request.data.get('group_id')
    user_id = request.data.get('user_id')
    username = request.data.get('username', 'Anonymous')
    message = request.data.get('message')
    
    if not group_id or not message:
        return Response({'error': 'Group ID and message are required'}, 
                       status=status.HTTP_400_BAD_REQUEST)
    
    try:
        group = TravelGroup.objects.get(group_code=group_id)
    except TravelGroup.DoesNotExist:
        try:
            group = TravelGroup.objects.get(id=group_id)
        except (TravelGroup.DoesNotExist, ValueError):
            return Response({'error': 'Group not found'},
                           status=status.HTTP_404_NOT_FOUND)
    
    # Get or create user
    user = None
    if user_id:
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            pass
    
    if not user:
        # Create anonymous user or use default
        user = User.objects.first() or User.objects.create_user(
            username=username,
            email=f"{username}@temp.com"
        )
    
    chat_message = ChatMessage.objects.create(
        group=group,
        user=user,
        message=message
    )
    
    return Response({
        'message': 'Message sent successfully',
        'data': ChatMessageSerializer(chat_message).data
    }, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_messages(request, group_id):
    """Get all messages for a group"""
    try:
        group = TravelGroup.objects.get(group_code=group_id)
    except TravelGroup.DoesNotExist:
        try:
            group = TravelGroup.objects.get(id=group_id)
        except (TravelGroup.DoesNotExist, ValueError):
            return Response({'error': 'Group not found'},
                           status=status.HTTP_404_NOT_FOUND)
    
    messages = ChatMessage.objects.filter(group=group)
    serializer = ChatMessageSerializer(messages, many=True)
    
    return Response({'messages': serializer.data}, status=status.HTTP_200_OK)
