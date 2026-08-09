# TravelTogether (WeTravel) - Full Stack Application

A full-stack web application built with Django and vanilla JavaScript that connects travelers to find travel buddies and form groups. Features OTP-based email verification, group management, and real-time chat functionality.

## 🎯 Project Overview

**TravelTogether** is a travel buddy finder platform that helps solo travelers connect with others planning trips to the same destinations. The application features user authentication with OTP verification, group management, real-time chat, and destination-based search functionality.

## 🛠️ Tech Stack

### Frontend
- **HTML5** - Structure
- **CSS3** - Styling
- **Vanilla JavaScript** - Client-side logic and API integration
- **Font Awesome** - Icons

### Backend
- **Django 4.2.7** - Python web framework
- **Django REST Framework** - REST API toolkit
- **SQLite** - Database (default, easily switchable to PostgreSQL/MySQL)
- **OTP System** - Email verification with 6-digit codes

## 📁 Project Structure

```
TravelTogether/
├── backend/                    # Django backend
│   ├── manage.py              # Django management script
│   ├── traveltogether/        # Main project settings
│   │   ├── settings.py       # Django settings
│   │   ├── urls.py           # Main URL configuration
│   │   └── wsgi.py           # WSGI configuration
│   ├── api/                   # Main app
│   │   ├── models.py         # Database models (User, Group, Message, OTP)
│   │   ├── views.py          # API views/endpoints
│   │   ├── serializers.py    # Data serialization
│   │   ├── urls.py           # API routes
│   │   └── admin.py          # Admin panel configuration
│   ├── requirements.txt      # Python dependencies
│   └── README.md             # Backend documentation
├── Frontend Files             # HTML, CSS, JS files
│   ├── index.html            # Landing page
│   ├── login.html            # Login page
│   ├── signup.html           # Signup page (with OTP)
│   ├── page.html             # Dashboard
│   ├── create.html           # Create group
│   ├── join.html             # Join group
│   ├── group.html            # Group chat
│   └── *.js                  # Frontend JavaScript files
└── README.md                  # This file
```

## 🚀 Quick Start Guide

### Prerequisites
- Python 3.8 or higher
- pip (Python package manager)
- A modern web browser

### Step 1: Set Up Backend

```bash
cd backend

# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Start Django server
python manage.py runserver
```

The backend will run on `http://localhost:8000`

### Step 2: Open Frontend

Open `index.html` in your web browser, or use a local server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js http-server
http-server -p 8080
```

Then navigate to `http://localhost:8080` in your browser.

## ✨ Features

1. **User Authentication with OTP**
   - User registration with email verification
   - OTP generation and verification
   - Secure login with password hashing
   - Session management using localStorage

2. **Group Management**
   - Create travel groups with unique 6-digit codes
   - Join groups using name and code
   - Search groups by destination
   - View group details and member count

3. **Real-time Chat**
   - Send messages to group members
   - View message history
   - Auto-refresh messages every 3 seconds

4. **Search Functionality**
   - Search for travel groups by destination
   - Display search results with group codes

## 📡 API Endpoints

### OTP
- `POST /api/otp/generate/` - Generate OTP for email
- `POST /api/otp/verify/` - Verify OTP code

### Authentication
- `POST /api/auth/signup/` - Register new user (requires OTP)
- `POST /api/auth/login/` - Login user

### Groups
- `POST /api/groups/create/` - Create travel group
- `POST /api/groups/join/` - Join existing group
- `GET /api/groups/search/?destination=goa` - Search groups
- `GET /api/groups/{id}/` - Get group details

### Chat
- `POST /api/chat/message/` - Send message
- `GET /api/chat/messages/{group_id}/` - Get group messages

For detailed API documentation, see [backend/README.md](backend/README.md)

## 🔄 OTP Registration Flow

1. User fills registration form
2. User enters email and clicks "Generate OTP"
3. Backend generates 6-digit OTP (currently shown in console for testing)
4. User enters OTP in the form
5. Backend verifies OTP before creating account
6. Account is created and user is logged in

## 🗄️ Database

The project uses **SQLite** by default (included with Django). The database file `db.sqlite3` is created automatically when you run migrations.

**Models:**
- **User** - Custom user model with ID proof fields
- **OTP** - OTP codes for email verification
- **TravelGroup** - Travel groups with unique codes
- **ChatMessage** - Messages in groups

## 🎓 Interview Explanation Points

### Architecture
- **Django Framework**: Python-based, follows MVC pattern (Models, Views, Templates)
- **RESTful API**: Clean API design using Django REST Framework
- **Database ORM**: Django ORM for database operations (no raw SQL needed)
- **Client-Server Architecture**: Frontend communicates with backend via REST API

### Security
- **OTP Verification**: Email verification before account creation
- **Password Hashing**: Django's built-in secure password hashing
- **Input Validation**: Both client-side and server-side validation
- **OTP Expiry**: OTPs expire after 10 minutes
- **One-time OTP**: Each OTP can only be used once

### Technical Skills Demonstrated
- Full-stack development (Frontend + Django Backend)
- RESTful API design and implementation
- Database modeling and relationships
- OTP-based authentication system
- Django ORM and migrations
- Asynchronous JavaScript (async/await, fetch API)
- Error handling and validation

## 🔒 Security Features

- Password hashing with Django's built-in system
- OTP-based email verification
- OTP expiry (10 minutes)
- One-time use OTPs
- Input validation on both frontend and backend
- CORS configuration for cross-origin requests

## 📝 Notes

- **OTP Testing**: Currently, OTP is shown in browser console for testing. In production, it should be sent via email.
- **Database**: SQLite is used for simplicity. Can easily switch to PostgreSQL or MySQL for production.
- **Session Management**: Uses localStorage for session. In production, you might use JWT tokens or Django sessions.

## 🐛 Troubleshooting

**Backend not starting?**
- Make sure Python is installed: `python --version`
- Check if virtual environment is activated
- Verify all dependencies are installed: `pip install -r requirements.txt`
- Check if port 8000 is available

**Frontend not connecting to backend?**
- Ensure Django server is running on `http://localhost:8000`
- Check browser console for CORS errors
- Verify API_BASE_URL in JavaScript files matches backend URL

**Migration errors?**
```bash
cd backend
python manage.py makemigrations api
python manage.py migrate
```

## 📄 License

This project is for educational/demonstration purposes.

---

**Happy Traveling! 🌍✈️**
