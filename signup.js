// API Base URL - Django backend
const API_BASE_URL = 'http://localhost:8000/api';

let otpGenerated = false;

// Generate OTP button
document.getElementById("generate-otp-btn").addEventListener("click", async function() {
    const email = document.getElementById("email").value.trim();
    const otpStatus = document.getElementById("otp-status");
    const otpInput = document.getElementById("otp-code");
    const generateBtn = document.getElementById("generate-otp-btn");

    if (!email) {
        alert("Please enter your email first.");
        return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert("Please enter a valid email address.");
        return;
    }

    try {
        generateBtn.disabled = true;
        generateBtn.textContent = "Generating OTP...";
        otpStatus.textContent = "";

        const response = await fetch(`${API_BASE_URL}/otp/generate/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });

        const data = await response.json();

        if (response.ok) {
            otpGenerated = true;
            otpInput.style.display = "block";
            otpInput.required = true;
            otpStatus.textContent = `OTP sent to ${email}. Check console for OTP (for testing). OTP: ${data.otp_code}`;
            otpStatus.style.color = "#4CAF50";
            
            // In production, remove the OTP from response and send via email
            console.log("OTP for testing:", data.otp_code);
            
            // Enable button again after 60 seconds
            setTimeout(() => {
                generateBtn.disabled = false;
                generateBtn.textContent = "Generate OTP";
            }, 60000);
        } else {
            otpStatus.textContent = data.error || "Failed to generate OTP";
            otpStatus.style.color = "#f44336";
            generateBtn.disabled = false;
            generateBtn.textContent = "Generate OTP";
        }
    } catch (error) {
        console.error('OTP generation error:', error);
        otpStatus.textContent = "Network error. Please make sure the backend server is running.";
        otpStatus.style.color = "#f44336";
        generateBtn.disabled = false;
        generateBtn.textContent = "Generate OTP";
    }
});

// Signup form submission
document.getElementById("signup-form").addEventListener("submit", async function(event) {
    event.preventDefault();
    
    // Fetch input values
    var username = document.getElementById("username").value.trim();
    var email = document.getElementById("email").value.trim();
    var idProof = document.getElementById("id-proof").value.trim();
    var idProofNumber = document.getElementById("id-proof-number").value.trim();
    var password = document.getElementById("password").value.trim();
    var confirmPassword = document.getElementById("confirm-password").value.trim();
    var otpCode = document.getElementById("otp-code").value.trim();
    
    // Client-side validation
    if (username === "" || email === "" || idProof === "" || idProofNumber === "" || password === "" || confirmPassword === "") {
        alert("Please fill out all fields.");
        return;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match. Please try again.");
        return;
    }

    if (!otpGenerated || !otpCode) {
        alert("Please generate and enter the OTP code.");
        return;
    }

    if (otpCode.length !== 6) {
        alert("OTP must be 6 digits.");
        return;
    }

    try {
        const signupBtn = document.getElementById("signup-btn");
        signupBtn.disabled = true;
        signupBtn.textContent = "Signing up...";

        // Send signup request to Django backend
        const response = await fetch(`${API_BASE_URL}/auth/signup/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
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

        const data = await response.json();

        if (response.ok) {
            // Store user info in localStorage
            localStorage.setItem('user', JSON.stringify(data.user));
            alert("Sign up successful! Welcome " + username + "!");
            window.location.href = "page.html";
        } else {
            // Handle error response
            const errorMsg = data.error || (data.detail || "Sign up failed. Please try again.");
            alert(errorMsg);
            signupBtn.disabled = false;
            signupBtn.textContent = "Sign Up";
        }
    } catch (error) {
        console.error('Signup error:', error);
        alert("Network error. Please make sure the Django backend server is running on port 8000.");
        document.getElementById("signup-btn").disabled = false;
        document.getElementById("signup-btn").textContent = "Sign Up";
    }
});
  