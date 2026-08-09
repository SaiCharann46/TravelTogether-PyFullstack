// API Base URL - Django backend
const API_BASE_URL = 'http://localhost:8000/api';

document.getElementById("login-form").addEventListener("submit", async function(event) {
    event.preventDefault();
  
    var email = document.getElementById("email").value.trim();
    var password = document.getElementById("password").value.trim();
    var errorMessage = document.getElementById("error-message");
  
    // Validate email and password
    if (email === "" || password === "") {
      errorMessage.textContent = "Email and password are required.";
      return;
    }

    try {
      // Send login request to Django backend
      const response = await fetch(`${API_BASE_URL}/auth/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Store user info in localStorage
        localStorage.setItem('user', JSON.stringify(data.user));
        errorMessage.textContent = ""; // Clear error message
        alert("Welcome, " + data.user.username + "! to WeTravel");
        window.location.href = "page.html";
      } else {
        errorMessage.textContent = data.error || "Incorrect email or password.";
      }
    } catch (error) {
      console.error('Login error:', error);
      errorMessage.textContent = "Network error. Please make sure the backend server is running.";
    }
  });