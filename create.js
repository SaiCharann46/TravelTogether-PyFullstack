// API Base URL — 127.0.0.1 to avoid Mac IPv6 issues
const API_BASE_URL = 'http://127.0.0.1:8000/api';

document.getElementById("group-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const groupName = document.getElementById("groupName").value.trim();
  const groupDescription = document.getElementById("groupDescription").value.trim();

  if (!groupName || !groupDescription) {
    showAlert("Please fill in both the group name and description.", "error");
    return;
  }

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userId = user.id || null;

  if (!userId) {
    showAlert("You must be logged in to create a group. Redirecting...", "error");
    setTimeout(() => { window.location.href = "login.html"; }, 1500);
    return;
  }

  const btn = document.getElementById("create-btn");
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner spinner"></i> Creating...';

  try {
    const response = await fetch(`${API_BASE_URL}/groups/create/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ group_name: groupName, group_description: groupDescription, user_id: userId })
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem('currentGroup', JSON.stringify(data.group));
      showAlert(`Group created! Code: ${data.group.group_code} — Redirecting to chat...`, "success");
      setTimeout(() => { window.location.href = "group.html"; }, 1500);
    } else {
      showAlert(data.error || "Failed to create group.", "error");
      btn.disabled = false;
      btn.innerHTML = '<i class="fas fa-plus-circle"></i> Create Group';
    }
  } catch (err) {
    console.error("Create group error:", err);
    showAlert("Cannot connect to server. Is the backend running on port 8000?", "error");
    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-plus-circle"></i> Create Group';
  }
});

function showAlert(msg, type) {
  const box = document.getElementById("alert-box");
  box.className = `alert alert-${type === "error" ? "error" : "success"} show`;
  box.innerHTML = `<i class="fas fa-${type === "error" ? "exclamation-circle" : "check-circle"}"></i> ${msg}`;
}