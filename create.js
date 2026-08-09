// API Base URL - Django backend
const API_BASE_URL = 'http://localhost:8000/api';

document.getElementById("group-form").addEventListener("submit", async function(event) {
    event.preventDefault();
  
    var groupName = document.getElementById("groupName").value.trim();
    var groupDescription = document.getElementById("groupDescription").value.trim();
  
    // Validate group name and description
    if (groupName === "" || groupDescription === "") {
      alert("Please fill out all fields.");
      return;
    }

    // Get user from localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user.id || null;

    try {
      // Send create group request to Django backend
      const response = await fetch(`${API_BASE_URL}/groups/create/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          group_name: groupName,
          group_description: groupDescription,
          user_id: userId
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Store group info in localStorage for the group page
        localStorage.setItem('currentGroup', JSON.stringify(data.group));
        alert("Group created successfully! Group Code: " + data.group.group_code);
        window.location.href = "group.html";
      } else {
        alert(data.error || "Failed to create group. Please try again.");
      }
    } catch (error) {
      console.error('Create group error:', error);
      alert("Network error. Please make sure the backend server is running.");
    }
  });