// WeTravel — Signup Logic
// Wrapped in DOMContentLoaded to guarantee all HTML elements exist before JS runs
const API_BASE_URL = 'http://127.0.0.1:8000/api';

document.addEventListener('DOMContentLoaded', function () {

  // ── Mirror email into OTP display field ──
  const emailInput = document.getElementById('email');
  const otpEmailDisplay = document.getElementById('otp-email-display');
  if (emailInput && otpEmailDisplay) {
    emailInput.addEventListener('input', function () {
      otpEmailDisplay.value = this.value;
    });
  }

  // ── Generate OTP button ──
  const otpBtn = document.getElementById('generate-otp-btn');
  if (otpBtn) {
    otpBtn.addEventListener('click', async function () {
      const email = document.getElementById('email').value.trim();
      const statusBox = document.getElementById('otp-status-box');
      const otpField = document.getElementById('otp-field');

      if (!email) {
        showAlert('Please enter your email address first.', 'error');
        return;
      }

      otpBtn.disabled = true;
      otpBtn.innerHTML = '<i class="fas fa-spinner spinner"></i>&nbsp;Sending...';
      statusBox.style.display = 'none';

      try {
        const res = await fetch(`${API_BASE_URL}/otp/generate/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });

        const data = await res.json();

        if (res.ok) {
          // Show OTP on screen (development mode — no real email needed)
          otpField.style.display = 'block';
          statusBox.style.display = 'block';
          statusBox.className = '';
          statusBox.innerHTML =
            '✅ OTP generated! &nbsp;<strong style="font-size:1.1rem;letter-spacing:2px;color:#fff;">Your OTP: ' +
            data.otp_code +
            '</strong>&nbsp; — copy this into the field below';

          // Countdown to resend
          let secs = 60;
          const t = setInterval(() => {
            secs--;
            otpBtn.innerHTML = `<i class="fas fa-clock"></i>&nbsp;Resend in ${secs}s`;
            if (secs <= 0) {
              clearInterval(t);
              otpBtn.disabled = false;
              otpBtn.innerHTML = '<i class="fas fa-redo"></i>&nbsp;Resend OTP';
            }
          }, 1000);

        } else {
          statusBox.style.display = 'block';
          statusBox.className = 'error';
          statusBox.textContent = '❌ ' + (data.error || 'Failed to generate OTP');
          otpBtn.disabled = false;
          otpBtn.innerHTML = '<i class="fas fa-key"></i>&nbsp;Send OTP';
        }

      } catch (err) {
        console.error('OTP error:', err);
        statusBox.style.display = 'block';
        statusBox.className = 'error';
        statusBox.textContent = '❌ Cannot connect to server. Is the backend running? (Terminal → python manage.py runserver)';
        otpBtn.disabled = false;
        otpBtn.innerHTML = '<i class="fas fa-key"></i>&nbsp;Send OTP';
      }
    });
  }

  // ── Create Account button (type=button, NOT submit) ──
  const signupBtn = document.getElementById('signup-btn');
  if (signupBtn) {
    signupBtn.addEventListener('click', async function () {

      const username        = document.getElementById('username').value.trim();
      const email           = document.getElementById('email').value.trim();
      const idProof         = document.getElementById('id-proof').value;
      const idProofNumber   = document.getElementById('id-proof-number').value.trim();
      const password        = document.getElementById('password').value.trim();
      const confirmPassword = document.getElementById('confirm-password').value.trim();
      const otpCode         = document.getElementById('otp-code').value.trim();

      // ── Validate ──
      if (!username || !email || !idProof || !idProofNumber || !password || !confirmPassword) {
        showAlert('Please fill out every field.', 'error'); return;
      }
      if (password !== confirmPassword) {
        showAlert('Passwords do not match.', 'error'); return;
      }
      if (password.length < 6) {
        showAlert('Password must be at least 6 characters.', 'error'); return;
      }
      if (!otpCode) {
        showAlert('Please generate the OTP first, then enter it.', 'error'); return;
      }

      signupBtn.disabled = true;
      signupBtn.innerHTML = '<i class="fas fa-spinner spinner"></i> Creating Account...';

      try {
        const res = await fetch(`${API_BASE_URL}/auth/signup/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username,
            email,
            id_proof_type: idProof,
            id_proof_number: idProofNumber,
            password,
            confirm_password: confirmPassword,
            otp_code: otpCode
          })
        });

        const data = await res.json();

        if (res.ok) {
          localStorage.setItem('user', JSON.stringify(data.user));
          showAlert('✅ Account created! Taking you to the dashboard...', 'success');
          setTimeout(() => { window.location.href = 'page.html'; }, 1500);

        } else {
          // Show the exact error from the server
          const errMsg = data.error || data.detail || JSON.stringify(data);
          showAlert('❌ ' + errMsg, 'error');
          signupBtn.disabled = false;
          signupBtn.innerHTML = 'Create Account &nbsp;<i class="fas fa-arrow-right"></i>';
        }

      } catch (err) {
        console.error('Signup error:', err);
        showAlert('❌ Cannot connect to server. Make sure backend is running on port 8000.', 'error');
        signupBtn.disabled = false;
        signupBtn.innerHTML = 'Create Account &nbsp;<i class="fas fa-arrow-right"></i>';
      }
    });
  }

  // ── Helper: show alert at the top of the form ──
  function showAlert(msg, type) {
    const box = document.getElementById('alert-box');
    if (!box) return;
    box.className = 'alert ' + (type === 'error' ? 'alert-error' : 'alert-success') + ' show';
    box.innerHTML = msg;
    box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

}); // end DOMContentLoaded