// API Base URL — 127.0.0.1 to avoid Mac IPv6 issues
const API_BASE_URL = 'http://127.0.0.1:8000/api';

document.getElementById("join-group-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const groupName = document.getElementById("group-name").value.trim();
  const groupCode = document.getElementById("group-code").value.trim();

  if (!groupName || !groupCode) {
    showAlert("Please fill in both the group name and code.", "error");
    return;
  }

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userId = user.id || null;

  const btn = document.getElementById("join-btn");
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner spinner"></i> Joining...';

  try {
    const response = await fetch(`${API_BASE_URL}/groups/join/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ group_name: groupName, group_code: groupCode, user_id: userId })
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem('currentGroup', JSON.stringify(data.group));
      showAlert("Joined successfully! Redirecting to chat...", "success");
      setTimeout(() => { window.location.href = "group.html"; }, 1200);
    } else {
      showAlert(data.error || "Invalid group name or code. Please try again.", "error");
      btn.disabled = false;
      btn.innerHTML = '<i class="fas fa-door-open"></i> Join Group';
    }
  } catch (err) {
    console.error("Join error:", err);
    showAlert("Cannot connect to server. Is the backend running on port 8000?", "error");
    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-door-open"></i> Join Group';
  }
});

function showAlert(msg, type) {
  const box = document.getElementById("alert-box");
  box.className = `alert alert-${type === "error" ? "error" : "success"} show`;
  box.innerHTML = `<i class="fas fa-${type === "error" ? "exclamation-circle" : "check-circle"}"></i> ${msg}`;
}