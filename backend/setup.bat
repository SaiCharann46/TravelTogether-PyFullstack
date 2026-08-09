@echo off
echo 🚀 Setting up TravelTogether Django Backend...

echo 📦 Creating virtual environment...
python -m venv venv

echo ✅ Activating virtual environment...
call venv\Scripts\activate.bat

echo 📥 Installing dependencies...
pip install -r requirements.txt

echo 🗄️  Running database migrations...
python manage.py makemigrations
python manage.py migrate

echo ✅ Setup complete!
echo.
echo To start the server, run:
echo   venv\Scripts\activate
echo   python manage.py runserver
echo.
echo The server will run on http://localhost:8000
pause
