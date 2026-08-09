// API Base URL - Django backend
const API_BASE_URL = 'http://localhost:8000/api';

document.getElementById("join-group-form").addEventListener("submit", async function(event) {
    event.preventDefault();
    var groupName = document.getElementById("group-name").value.trim();
    var groupCode = document.getElementById("group-code").value.trim();
    var joinStatus = document.getElementById("join-status");
    
    if (groupName === "" || groupCode === "") {
      joinStatus.textContent = "Please fill out all fields.";
      return;
    }

    // Get user from localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user.id || null;

    try {
      // Send join group request to Django backend
      const response = await fetch(`${API_BASE_URL}/groups/join/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          group_name: groupName,
          group_code: groupCode,
          user_id: userId
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Store group info in localStorage for the group page
        localStorage.setItem('currentGroup', JSON.stringify(data.group));
        joinStatus.textContent = "Successfully joined group!";
        setTimeout(() => {
          window.location.href = "group.html";
        }, 1000);
      } else {
        joinStatus.textContent = data.error || "Invalid group name or code. Please try again.";
      }
    } catch (error) {
      console.error('Join group error:', error);
      joinStatus.textContent = "Network error. Please make sure the backend server is running.";
    }
  });
  
  