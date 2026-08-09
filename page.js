// API Base URL — 127.0.0.1 to avoid Mac IPv6 issues
const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Show logged-in user name
window.addEventListener('DOMContentLoaded', function () {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const el = document.getElementById('nav-username');
  if (el && user.username) {
    el.textContent = '👤 ' + user.username;
  }
  const greeting = document.getElementById('dash-greeting');
  if (greeting && user.username) {
    greeting.textContent = `Welcome back, ${user.username}! Search for a destination or create your own group.`;
  }
});

// Logout
document.getElementById('logout-btn')?.addEventListener('click', function () {
  localStorage.removeItem('user');
  localStorage.removeItem('currentGroup');
  window.location.href = 'login.html';
});

// Search form
document.getElementById("search-form").addEventListener("submit", async function (e) {
  e.preventDefault();
  const destination = document.getElementById("search").value.trim();
  const resultsList = document.getElementById("results-list");
  const resultsSection = document.getElementById("results-section");

  if (!destination) {
    resultsList.innerHTML = '<li><i class="fas fa-info-circle"></i> Please enter a destination to search.</li>';
    resultsSection.style.display = "block";
    return;
  }

  resultsList.innerHTML = '<li><i class="fas fa-spinner spinner"></i> Searching...</li>';
  resultsSection.style.display = "block";

  try {
    const response = await fetch(`${API_BASE_URL}/groups/search/?destination=${encodeURIComponent(destination)}`);
    const data = await response.json();

    if (response.ok && data.results && data.results.length > 0) {
      resultsList.innerHTML = data.results.map(group =>
        `<li><i class="fas fa-users"></i> <strong>${group.name}</strong> &nbsp;·&nbsp; Code: <code style="background:rgba(99,102,241,0.15);padding:0.1rem 0.4rem;border-radius:5px;color:#a5b4fc">#${group.code}</code> &nbsp;·&nbsp; ${group.member_count} member${group.member_count !== 1 ? 's' : ''}<br><small style="color:#64748b;margin-top:0.2rem;display:block">${group.description || ''}</small></li>`
      ).join('');
    } else {
      resultsList.innerHTML = `<li><i class="fas fa-search"></i> No groups found for "<strong>${destination}</strong>". <a href="create.html" style="color:#a5b4fc">Create one!</a></li>`;
    }
  } catch (err) {
    console.error('Search error:', err);
    resultsList.innerHTML = '<li><i class="fas fa-wifi"></i> Cannot connect to server. Make sure backend is running.</li>';
  }
});
