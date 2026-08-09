// API Base URL — 127.0.0.1 to avoid Mac IPv6 issues
const API_BASE_URL = 'http://127.0.0.1:8000/api';

const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
const currentGroup = JSON.parse(localStorage.getItem('currentGroup') || '{}');

// ── On page load ──
window.addEventListener('DOMContentLoaded', function () {
  loadGroupInfo();
  loadMessages();
  // Poll every 3 seconds for new messages
  setInterval(loadMessages, 3000);

  // Show logged in user in topbar
  const el = document.getElementById('topbar-user');
  if (el && currentUser.username) el.textContent = '👤 ' + currentUser.username;

  // Send on Enter key
  document.getElementById("message-input").addEventListener("keydown", function (e) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  });
});

// Logout
document.getElementById("logout-btn")?.addEventListener("click", function () {
  localStorage.removeItem('user');
  localStorage.removeItem('currentGroup');
  window.location.href = 'login.html';
});

// ── Load Group Info ──
function loadGroupInfo() {
  const groupName = currentGroup.group_name || currentGroup.groupName || 'Travel Group';
  const groupDesc = currentGroup.group_description || currentGroup.groupDescription || '';
  const groupCode = currentGroup.group_code || currentGroup.group_code || '';
  const memberCount = currentGroup.member_count || '--';

  // Sidebar
  document.getElementById("group-name-display").textContent = groupName;
  document.getElementById("group-code-display").textContent = `Code: ${groupCode}`;
  document.getElementById("group-desc-display").textContent = groupDesc;
  document.getElementById("member-count").textContent = `${memberCount} member${memberCount !== 1 ? 's' : ''}`;

  // Topbar
  document.getElementById("topbar-group-name").textContent = groupName;
  document.title = `WeTravel — ${groupName}`;
}

// ── Load Messages ──
let lastMessageCount = 0;

async function loadMessages() {
  const groupId = currentGroup.group_code || currentGroup.groupCode || currentGroup.id;
  if (!groupId) return;

  try {
    const response = await fetch(`${API_BASE_URL}/chat/messages/${groupId}/`);
    const data = await response.json();

    if (response.ok && data.messages) {
      if (data.messages.length !== lastMessageCount) {
        lastMessageCount = data.messages.length;
        displayMessages(data.messages);
      }
    }
  } catch (err) {
    console.error('Load messages error:', err);
  }
}

// ── Display Messages ──
function displayMessages(messages) {
  const chatBox = document.getElementById("chat-box");

  if (messages.length === 0) {
    chatBox.innerHTML = `
      <div class="chat-empty">
        <i class="fas fa-comments"></i>
        <p>No messages yet. Say hello! 👋</p>
      </div>`;
    return;
  }

  const wasAtBottom = chatBox.scrollHeight - chatBox.scrollTop <= chatBox.clientHeight + 60;

  chatBox.innerHTML = messages.map(msg => {
    const isMe = currentUser.username && msg.username === currentUser.username;
    const initials = (msg.username || 'A')[0].toUpperCase();
    const time = new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return `
      <div class="msg-wrapper ${isMe ? 'mine' : ''}">
        <div class="msg-avatar ${isMe ? 'mine-av' : ''}">${initials}</div>
        <div class="msg-content">
          <span class="msg-username">${isMe ? 'You' : msg.username}</span>
          <div class="msg-bubble">${escapeHtml(msg.message)}</div>
          <span class="msg-time">${time}</span>
        </div>
      </div>`;
  }).join('');

  if (wasAtBottom) chatBox.scrollTop = chatBox.scrollHeight;
}

// ── Send Message ──
document.getElementById("send-button").addEventListener("click", sendMessage);

async function sendMessage() {
  const input = document.getElementById("message-input");
  const message = input.value.trim();
  if (!message) return;

  const groupId = currentGroup.group_code || currentGroup.groupCode || currentGroup.id;
  if (!groupId) {
    alert("No group selected. Please join or create a group first.");
    return;
  }

  input.value = "";

  try {
    const response = await fetch(`${API_BASE_URL}/chat/message/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        group_id: groupId,
        user_id: currentUser.id || null,
        username: currentUser.username || 'Anonymous',
        message: message
      })
    });

    if (response.ok) {
      loadMessages(); // Refresh chat
    } else {
      input.value = message; // Restore on failure
    }
  } catch (err) {
    console.error('Send error:', err);
    input.value = message;
  }
}

// ── Escape HTML (XSS prevention) ──
function escapeHtml(text) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(text));
  return div.innerHTML;
}
