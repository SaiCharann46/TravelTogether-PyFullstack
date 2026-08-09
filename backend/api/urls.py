from django.urls import path
from . import views

urlpatterns = [
    # OTP endpoints
    path('otp/generate/', views.generate_otp, name='generate_otp'),
    path('otp/verify/', views.verify_otp, name='verify_otp'),
    
    # Authentication
    path('auth/signup/', views.signup, name='signup'),
    path('auth/login/', views.login, name='login'),
    
    # Groups
    path('groups/create/', views.create_group, name='create_group'),
    path('groups/join/', views.join_group, name='join_group'),
    path('groups/search/', views.search_groups, name='search_groups'),
    path('groups/<str:group_id>/', views.get_group_details, name='get_group_details'),
    
    # Chat
    path('chat/message/', views.send_message, name='send_message'),
    path('chat/messages/<str:group_id>/', views.get_messages, name='get_messages'),
]
