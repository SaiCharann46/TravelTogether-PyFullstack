// WeTravel Signup — v5
// All functions are GLOBAL (window.*) so onclick="..." in HTML always finds them

var API = 'http://127.0.0.1:8000/api';

// ─────────────────────────────────────────
// Called by: onclick="generateOTP()"
// ─────────────────────────────────────────
async function generateOTP() {
  var email      = document.getElementById('email').value.trim();
  var statusBox  = document.getElementById('otp-status-box');
  var otpField   = document.getElementById('otp-field');
  var btn        = document.getElementById('generate-otp-btn');

  if (!email) {
    setAlert('Please type your email address in the Email field first.', 'error');
    return;
  }

  btn.disabled    = true;
  btn.textContent = '⏳ Sending...';
  statusBox.style.display = 'none';

  try {
    var res  = await fetch(API + '/otp/generate/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email })
    });
    var data = await res.json();

    if (res.ok) {
      otpField.style.display  = 'block';
      statusBox.style.display = 'block';
      statusBox.className     = '';
      statusBox.innerHTML     =
        '✅ OTP ready! &nbsp;' +
        '<strong style="font-size:1.15rem;letter-spacing:3px;color:#fff;background:rgba(255,255,255,0.1);padding:2px 10px;border-radius:6px;">' +
        data.otp_code +
        '</strong>' +
        '&nbsp;&nbsp;← copy this number into the box below';

      // Countdown timer
      var secs = 60;
      var timer = setInterval(function () {
        secs--;
        btn.textContent = '⏳ Resend in ' + secs + 's';
        if (secs <= 0) {
          clearInterval(timer);
          btn.disabled    = false;
          btn.textContent = '🔄 Resend OTP';
        }
      }, 1000);

    } else {
      statusBox.style.display = 'block';
      statusBox.className     = 'err';
      statusBox.textContent   = '❌ ' + (data.error || 'Could not generate OTP');
      btn.disabled            = false;
      btn.textContent         = '🔑 Send OTP';
    }

  } catch (err) {
    console.error('OTP fetch error:', err);
    statusBox.style.display = 'block';
    statusBox.className     = 'err';
    statusBox.textContent   =
      '❌ Cannot reach server. Is the backend running? ' +
      '(In VS Code terminal: python manage.py runserver)';
    btn.disabled    = false;
    btn.textContent = '🔑 Send OTP';
  }
}


// ─────────────────────────────────────────
// Called by: onclick="doSignup()"
// ─────────────────────────────────────────
async function doSignup() {
  var username       = document.getElementById('username').value.trim();
  var email          = document.getElementById('email').value.trim();
  var idProof        = document.getElementById('id-proof').value;
  var idProofNumber  = document.getElementById('id-proof-number').value.trim();
  var password       = document.getElementById('password').value.trim();
  var confirmPw      = document.getElementById('confirm-password').value.trim();
  var otpCode        = document.getElementById('otp-code').value.trim();
  var btn            = document.getElementById('signup-btn');

  // Validate
  if (!username)      { setAlert('❌ Please enter a username.',                     'error'); return; }
  if (!email)         { setAlert('❌ Please enter your email.',                     'error'); return; }
  if (!idProof)       { setAlert('❌ Please select your ID proof type.',            'error'); return; }
  if (!idProofNumber) { setAlert('❌ Please enter your ID proof number.',           'error'); return; }
  if (!password)      { setAlert('❌ Please enter a password.',                     'error'); return; }
  if (password.length < 6) { setAlert('❌ Password must be at least 6 characters.','error'); return; }
  if (password !== confirmPw) { setAlert('❌ Passwords do not match.',              'error'); return; }
  if (!otpCode)       { setAlert('❌ Please click Send OTP first, then enter the code.', 'error'); return; }

  btn.disabled     = true;
  btn.textContent  = '⏳ Creating account...';

  try {
    var res = await fetch(API + '/auth/signup/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username:        username,
        email:           email,
        id_proof_type:   idProof,
        id_proof_number: idProofNumber,
        password:        password,
        confirm_password: confirmPw,
        otp_code:        otpCode
      })
    });
    var data = await res.json();

    if (res.ok) {
      localStorage.setItem('user', JSON.stringify(data.user));
      setAlert('✅ Account created! Going to dashboard...', 'success');
      setTimeout(function () { window.location.href = 'page.html'; }, 1500);

    } else {
      var msg = data.error || data.detail || JSON.stringify(data);
      setAlert('❌ ' + msg, 'error');
      btn.disabled    = false;
      btn.innerHTML   = 'Create Account &nbsp;<i class="fas fa-arrow-right"></i>';
    }

  } catch (err) {
    console.error('Signup error:', err);
    setAlert('❌ Cannot reach server. Make sure backend is running on port 8000.', 'error');
    btn.disabled    = false;
    btn.innerHTML   = 'Create Account &nbsp;<i class="fas fa-arrow-right"></i>';
  }
}


// ─────────────────────────────────────────
// Helper: show coloured alert at top
// ─────────────────────────────────────────
function setAlert(msg, type) {
  var box = document.getElementById('alert-box');
  if (!box) return;
  box.className = 'alert ' + (type === 'error' ? 'alert-error' : 'alert-success') + ' show';
  box.innerHTML = msg;
  box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}