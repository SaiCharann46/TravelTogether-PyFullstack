// API Base URL — using 127.0.0.1 explicitly to avoid IPv6 (::1) issues on Mac
const API_BASE_URL = 'http://127.0.0.1:8000/api';

let otpVerified = false;

// Auto-fill OTP email field when user types in the email field
document.getElementById("email").addEventListener("input", function () {
  const display = document.getElementById("otp-email-display");
  if (display) display.value = this.value;
});

// ── Generate OTP ──
document.getElementById("generate-otp-btn").addEventListener("click", async function () {
  const email = document.getElementById("email").value.trim();
  const statusBox = document.getElementById("otp-status-box");
  const otpField = document.getElementById("otp-field");
  const btn = this;

  if (!email) {
    showAlert("Please enter your email address first.", "error");
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showAlert("Please enter a valid email address.", "error");
    return;
  }

  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner spinner"></i> Sending...';

  try {
    const response = await fetch(`${API_BASE_URL}/otp/generate/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });

    const data = await response.json();

    if (response.ok) {
      otpField.style.display = "block";
      statusBox.style.display = "block";
      statusBox.className = "otp-status-box";
      // Show OTP on screen for testing (remove in production)
      statusBox.innerHTML = `<i class="fas fa-check-circle"></i> OTP sent! <strong>Your OTP: ${data.otp_code}</strong> (testing mode)`;

      // Countdown to re-enable button
      let count = 60;
      const timer = setInterval(() => {
        count--;
        btn.innerHTML = `<i class="fas fa-clock"></i> Resend in ${count}s`;
        if (count <= 0) {
          clearInterval(timer);
          btn.disabled = false;
          btn.innerHTML = '<i class="fas fa-redo"></i> Resend OTP';
        }
      }, 1000);
    } else {
      statusBox.style.display = "block";
      statusBox.className = "otp-status-box error";
      statusBox.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${data.error || "Failed to generate OTP"}`;
      btn.disabled = false;
      btn.innerHTML = '<i class="fas fa-key"></i> Send OTP';
    }
  } catch (err) {
    console.error("OTP error:", err);
    statusBox.style.display = "block";
    statusBox.className = "otp-status-box error";
    statusBox.innerHTML = '<i class="fas fa-wifi"></i> Cannot connect to server. Is the backend running on port 8000?';
    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-key"></i> Send OTP';
  }
});

// ── Signup Form Submit ──
document.getElementById("signup-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const idProof = document.getElementById("id-proof").value;
  const idProofNumber = document.getElementById("id-proof-number").value.trim();
  const password = document.getElementById("password").value.trim();
  const confirmPassword = document.getElementById("confirm-password").value.trim();
  const otpCode = document.getElementById("otp-code").value.trim();

  // Validations
  if (!username || !email || !idProof || !idProofNumber || !password || !confirmPassword) {
    showAlert("Please fill out all fields.", "error"); return;
  }
  if (password !== confirmPassword) {
    showAlert("Passwords do not match.", "error"); return;
  }
  if (password.length < 6) {
    showAlert("Password must be at least 6 characters.", "error"); return;
  }
  if (!otpCode || otpCode.length !== 6) {
    showAlert("Please generate and enter the 6-digit OTP.", "error"); return;
  }

  const btn = document.getElementById("signup-btn");
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner spinner"></i> Creating Account...';

  try {
    const response = await fetch(`${API_BASE_URL}/auth/signup/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, id_proof_type: idProof, id_proof_number: idProofNumber, password, confirm_password: confirmPassword, otp_code: otpCode })
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem('user', JSON.stringify(data.user));
      showAlert("Account created! Redirecting...", "success");
      setTimeout(() => { window.location.href = "page.html"; }, 1200);
    } else {
      const msg = data.error || data.detail || JSON.stringify(data);
      showAlert(msg, "error");
      btn.disabled = false;
      btn.innerHTML = 'Create Account &nbsp;<i class="fas fa-arrow-right"></i>';
    }
  } catch (err) {
    console.error("Signup error:", err);
    showAlert("Cannot connect to server. Is the backend running?", "error");
    btn.disabled = false;
    btn.innerHTML = 'Create Account &nbsp;<i class="fas fa-arrow-right"></i>';
  }
});

function showAlert(msg, type) {
  const box = document.getElementById("alert-box");
  box.className = `alert alert-${type === "error" ? "error" : "success"} show`;
  box.innerHTML = `<i class="fas fa-${type === "error" ? "exclamation-circle" : "check-circle"}"></i> ${msg}`;
  box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}