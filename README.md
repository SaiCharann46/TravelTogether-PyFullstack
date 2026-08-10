# ✈️ TravelTogether — Find Your Travel Buddies

> Connect with like-minded travelers, create travel groups, and explore the world together.

![WeTravel](https://img.shields.io/badge/WeTravel-Travel%20App-6366f1?style=for-the-badge)
![Django](https://img.shields.io/badge/Django-4.2-092E20?style=for-the-badge&logo=django)
![Python](https://img.shields.io/badge/Python-3.13-3776AB?style=for-the-badge&logo=python)

---

## 🚀 Features

- 🔐 **OTP-based Signup** — Email verification with one-time password
- 👥 **Create Travel Groups** — Start a group with a unique invite code
- 🔗 **Join Groups** — Enter group name + code to join any trip
- 💬 **Real-time Group Chat** — Chat with your travel companions
- 🔍 **Search Destinations** — Find groups by destination name
- 🌙 **Modern Dark UI** — Glassmorphism design with smooth animations

---

## 🧱 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | HTML5, CSS3 (Glassmorphism), Vanilla JavaScript |
| **Backend** | Django 4.2 (Python) |
| **REST API** | Django REST Framework (DRF) |
| **Database** | SQLite3 |
| **CORS** | django-cors-headers |

---

## ⚙️ How to Run Locally

### 1. Clone the project
```bash
git clone https://github.com/YOUR_USERNAME/TravelTogether.git
cd TravelTogether
```

### 2. Set up the backend
```bash
cd backend
python3 -m venv venv
source venv/bin/activate        # Mac/Linux
# venv\Scripts\activate         # Windows

pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```
Backend runs at → `http://127.0.0.1:8000`

### 3. Run the frontend
- Open VS Code → right-click `index.html` → **"Open with Live Server"**
- Frontend runs at → `http://127.0.0.1:5500`

### 4. Seed sample data (optional)
```bash
python manage.py seed_data
```
Creates 3 users + 5 travel groups for testing.

---

## 📁 Project Structure

```
TravelTogether/
├── index.html          # Landing page
├── signup.html/js      # Signup with OTP
├── login.html/js       # Login
├── page.html/js        # Dashboard + search
├── create.html/js      # Create a group
├── join.html/js        # Join a group
├── group.html/js       # Group chat
├── style.css           # Shared design system
└── backend/
    ├── manage.py
    ├── requirements.txt
    ├── api/
    │   ├── models.py       # User, OTP, TravelGroup, ChatMessage
    │   ├── views.py        # All API endpoints
    │   ├── serializers.py  # DRF serializers
    │   └── urls.py         # API routes
    └── traveltogether/
        └── settings.py     # Django config
```

---

## 🔑 Sample Login Credentials

After running `python manage.py seed_data`:

| Email | Password |
|---|---|
| alice@example.com | alice123 |
| bob@example.com | bob123 |
| charlie@example.com | charlie123 |

---

## 🗺️ API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/otp/generate/` | Generate OTP for email |
| POST | `/api/auth/signup/` | Create new account |
| POST | `/api/auth/login/` | Login |
| POST | `/api/groups/create/` | Create a travel group |
| POST | `/api/groups/join/` | Join a group |
| GET | `/api/groups/search/?destination=` | Search groups |
| GET | `/api/chat/messages/<group_code>/` | Get chat messages |
| POST | `/api/chat/message/` | Send a message |

---

## 👨‍💻 Made with ❤️ using Django + Vanilla JS
