document.addEventListener('DOMContentLoaded', function () {
    // Function to display the current date
    function displayCurrentDate() {
        const today = new Date();
        const date = today.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        document.getElementById('currentDate').textContent += date;
    }

    // Call the function to display the date
    displayCurrentDate();

    // Rest of your dashboard JS code...
});

// Load the sidebar content from sidebar.html and insert it into the sidebar-container div
fetch('sidebar.html')
    .then(response => response.text())
    .then(sidebarHtml => {
        document.getElementById('sidebar-container').innerHTML = sidebarHtml;
    });
