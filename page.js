// API Base URL - Django backend
const API_BASE_URL = 'http://localhost:8000/api';

document.getElementById("search-form").addEventListener("submit", async function(event) {
    event.preventDefault(); // Prevent form submission
    var destination = document.getElementById("search").value.trim();
    var resultsList = document.getElementById("results-list");
    
    if (!destination) {
      resultsList.innerHTML = "<li>Please enter a destination to search.</li>";
      return;
    }

    try {
      // Send search request to Django backend
      const response = await fetch(`${API_BASE_URL}/groups/search/?destination=${encodeURIComponent(destination)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (response.ok && data.results && data.results.length > 0) {
        // Display search results
        resultsList.innerHTML = data.results.map(group => 
          `<li>${group.name} -- #${group.code} (${group.member_count} members)</li>`
        ).join('');
      } else {
        resultsList.innerHTML = "<li>No groups found for this destination. Try creating a new group!</li>";
      }
    } catch (error) {
      console.error('Search error:', error);
      resultsList.innerHTML = "<li>Error searching groups. Please make sure the backend server is running.</li>";
    }
});

