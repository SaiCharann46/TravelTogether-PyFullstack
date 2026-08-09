# TravelTogether Django Backend

A Django REST API backend for the TravelTogether travel buddy finder application with OTP-based email verification.

## 🚀 Quick Start

### Prerequisites
- Python 3.8 or higher
- pip (Python package manager)

### Installation

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Create a virtual environment (recommended):**
```bash
python -m venv venv

# On Windows
venv\Scripts\activate

# On macOS/Linux
source venv/bin/activate
```

3. **Install dependencies:**
```bash
pip install -r requirements.txt
```

4. **Run database migrations:**
```bash
python manage.py makemigrations
python manage.py migrate
```

5. **Create a superuser (optional, for admin panel):**
```bash
python manage.py createsuperuser
```

6. **Start the development server:**
```bash
python manage.py runserver
```

The server will run on `http://localhost:8000`

## 📡 API Endpoints

### OTP Endpoints

#### POST `/api/otp/generate/`
Generate OTP for email verification.

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "message": "OTP generated successfully",
  "otp_code": "123456"
}
```
*Note: In production, OTP should be sent via email, not returned in response.*

#### POST `/api/otp/verify/`
Verify OTP code.

**Request:**
```json
{
  "email": "user@example.com",
  "otp_code": "123456"
}
```

### Authentication

#### POST `/api/auth/signup/`
Register a new user (requires OTP verification).

**Request:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123",
  "confirm_password": "password123",
  "id_proof_type": "aadhar",
  "id_proof_number": "1234-5678-9012",
  "otp_code": "123456"
}
```

**Response:**
```json
{
  "message": "Sign up successful!",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "is_verified": true
  }
}
```

#### POST `/api/auth/login/`
Login existing user.

**Request:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Groups

#### POST `/api/groups/create/`
Create a new travel group.

**Request:**
```json
{
  "group_name": "Trip to Goa",
  "group_description": "All are welcome!",
  "user_id": 1
}
```

#### POST `/api/groups/join/`
Join an existing group.

**Request:**
```json
{
  "group_name": "Trip to Goa",
  "group_code": "152535",
  "user_id": 1
}
```

#### GET `/api/groups/search/?destination=goa`
Search groups by destination.

#### GET `/api/groups/{group_id}/`
Get group details by ID or code.

### Chat

#### POST `/api/chat/message/`
Send a message to a group.

**Request:**
```json
{
  "group_id": "152535",
  "user_id": 1,
  "username": "john_doe",
  "message": "Hello everyone!"
}
```

#### GET `/api/chat/messages/{group_id}/`
Get all messages for a group.

## 🗄️ Database Models

### User Model
- Extends Django's AbstractUser
- Fields: username, email, id_proof_type, id_proof_number, is_verified

### OTP Model
- Stores OTP codes for email verification
- Auto-expires after 10 minutes
- One-time use only

### TravelGroup Model
- Travel groups with unique 6-digit codes
- Many-to-many relationship with users (members)
- Foreign key to owner

### ChatMessage Model
- Messages in groups
- Foreign keys to group and user
- Timestamped

## 🔒 Security Features

- **Password Hashing**: Django's built-in password hashing
- **OTP Verification**: Email verification before account creation
- **OTP Expiry**: OTPs expire after 10 minutes
- **One-time OTP**: Each OTP can only be used once
- **Input Validation**: Server-side validation for all inputs

## 🛠️ Technologies Used

- **Django 4.2.7** - Web framework
- **Django REST Framework** - REST API toolkit
- **django-cors-headers** - CORS handling
- **SQLite** - Database (default, can be changed to PostgreSQL/MySQL)

## 📝 Admin Panel

Access Django admin at `http://localhost:8000/admin/` (after creating superuser)

You can manage:
- Users
- Travel Groups
- Chat Messages
- OTPs

## 🔄 OTP Flow

1. User enters email and clicks "Generate OTP"
2. Backend generates 6-digit OTP and stores it
3. OTP is sent to user (currently shown in console for testing)
4. User enters OTP during signup
5. Backend verifies OTP before creating account
6. OTP is marked as used and cannot be reused

## 🐛 Troubleshooting

**Migration errors?**
```bash
python manage.py makemigrations api
python manage.py migrate
```

**Port already in use?**
```bash
python manage.py runserver 8001
```
Then update frontend API_BASE_URL to use port 8001.

**Import errors?**
Make sure you're in the backend directory and virtual environment is activated.

## 📚 Interview Explanation Points

1. **Django ORM**: Database operations through Python objects
2. **REST API**: Clean endpoint design with Django REST Framework
3. **OTP Security**: Email verification before account creation
4. **Model Relationships**: Foreign keys and many-to-many relationships
5. **Migrations**: Database schema management
6. **Admin Panel**: Built-in admin interface for data management
