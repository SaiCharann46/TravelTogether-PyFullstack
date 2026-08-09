// API Base URL — using 127.0.0.1 to avoid Mac IPv6 (::1) issues
const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Toggle password visibility
document.getElementById("toggle-pw")?.addEventListener("click", function () {
  const pw = document.getElementById("password");
  const icon = this.querySelector("i");
  if (pw.type === "password") {
    pw.type = "text";
    icon.className = "fas fa-eye-slash";
  } else {
    pw.type = "password";
    icon.className = "fas fa-eye";
  }
});

// Login form submit
document.getElementById("login-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    showAlert("Please enter your email and password.", "error");
    return;
  }

  const btn = document.getElementById("login-btn");
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner spinner"></i> Logging in...';

  try {
    const response = await fetch(`${API_BASE_URL}/auth/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem('user', JSON.stringify(data.user));
      showAlert("Login successful! Redirecting...", "success");
      setTimeout(() => { window.location.href = "page.html"; }, 1000);
    } else {
      showAlert(data.error || "Incorrect email or password.", "error");
      btn.disabled = false;
      btn.innerHTML = 'Login &nbsp;<i class="fas fa-arrow-right"></i>';
    }
  } catch (err) {
    console.error("Login error:", err);
    showAlert("Cannot connect to server. Is the backend running on port 8000?", "error");
    btn.disabled = false;
    btn.innerHTML = 'Login &nbsp;<i class="fas fa-arrow-right"></i>';
  }
});

function showAlert(msg, type) {
  const box = document.getElementById("alert-box");
  box.className = `alert alert-${type === "error" ? "error" : "success"} show`;
  box.innerHTML = `<i class="fas fa-${type === "error" ? "exclamation-circle" : "check-circle"}"></i> ${msg}`;
}