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

//sidebar fetch js for all the pages used

fetch('sidebar.html')
    .then(response => response.text())
    .then(sidebarHtml => {
        // Inject the sidebar HTML
        document.getElementById('sidebar-container').innerHTML = sidebarHtml;

        // Highlight the active link based on the current URL
        const currentPath = window.location.pathname.split('/').pop(); // Get the filename, e.g., 'dashboard.html'

        // Query all links in the sidebar
        const navLinks = document.querySelectorAll('#sidebar-container .list-group-item');

        // Loop through each link to find a match
        navLinks.forEach(link => {
            if (link.getAttribute('href') === currentPath) {
                link.classList.add('active-link'); // Add the active class to the matching link
            }
        });
    });


