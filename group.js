// API Base URL - Django backend
const API_BASE_URL = 'http://localhost:8000/api';

// Load group info and messages when page loads
window.addEventListener('DOMContentLoaded', async function() {
  loadGroupInfo();
  loadMessages();
  // Refresh messages every 3 seconds
  setInterval(loadMessages, 3000);
});

// Load group information
function loadGroupInfo() {
  const group = JSON.parse(localStorage.getItem('currentGroup') || '{}');
  // API returns snake_case keys: group_name, group_description
  const groupName = group.group_name || group.groupName;
  const groupDescription = group.group_description || group.groupDescription;
  if (groupName) {
    const nameElement = document.querySelector('.name h1');
    const descElement = document.querySelector('.disc h1');
    if (nameElement) nameElement.textContent = 'GROUP NAME: ' + groupName;
    if (descElement) descElement.textContent = 'DESCRIPTION: ' + groupDescription;
  }
}

// Load messages from backend
async function loadMessages() {
  const group = JSON.parse(localStorage.getItem('currentGroup') || '{}');
  // Support both API snake_case (group_code) and legacy camelCase (groupCode)
  const groupId = group.group_code || group.groupCode || group.id;
  
  if (!groupId) return;

  try {
    const response = await fetch(`${API_BASE_URL}/chat/messages/${groupId}/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    if (response.ok && data.messages) {
      displayMessages(data.messages);
    }
  } catch (error) {
    console.error('Load messages error:', error);
  }
}

// Display messages in chat box
function displayMessages(messages) {
  var chatBox = document.getElementById("chat-box");
  chatBox.innerHTML = ''; // Clear existing messages

  messages.forEach(msg => {
    var messageElement = document.createElement("div");
    messageElement.classList.add("message");

    // Use textContent to prevent XSS from user-generated content
    var strongEl = document.createElement('strong');
    strongEl.textContent = (msg.username || 'Anonymous') + ': ';

    var textNode = document.createTextNode(msg.message);

    var smallEl = document.createElement('small');
    smallEl.style.cssText = 'display: block; color: #666; font-size: 0.8em;';
    smallEl.textContent = new Date(msg.timestamp).toLocaleString();

    messageElement.appendChild(strongEl);
    messageElement.appendChild(textNode);
    messageElement.appendChild(smallEl);
    chatBox.appendChild(messageElement);
  });

  // Scroll to bottom
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Send message event listeners
document.getElementById("send-button").addEventListener("click", sendMessage);

document.getElementById("message-input").addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    sendMessage();
  }
});

// Send message to backend
async function sendMessage() {
  var messageInput = document.getElementById("message-input");
  var message = messageInput.value.trim();

  if (message === "") return;

  const group = JSON.parse(localStorage.getItem('currentGroup') || '{}');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  // Support both API snake_case (group_code) and legacy camelCase (groupCode)
  const groupId = group.group_code || group.groupCode || group.id;

  if (!groupId) {
    alert("Group information not found. Please join or create a group first.");
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/chat/message/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          group_id: groupId,
          user_id: user.id || null,
          username: user.username || 'Anonymous',
          message: message
        })
      });

    const data = await response.json();

    if (response.ok) {
      // Clear input field
      messageInput.value = "";
      // Reload messages to show the new one
      loadMessages();
    } else {
      alert(data.error || "Failed to send message. Please try again.");
    }
  } catch (error) {
    console.error('Send message error:', error);
    alert("Network error. Please make sure the backend server is running.");
  }
}
