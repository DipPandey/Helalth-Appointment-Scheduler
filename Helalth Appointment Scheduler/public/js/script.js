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


function handleCheckIn(appointmentId) {
    console.log('Checking in for appointment:', appointmentId);

    // Make an API call to check in
    fetch(`/appointments/check-in/${appointmentId}`, {
        method: 'PATCH', // Assuming PATCH is used to update the status of an appointment
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
        },
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            alert('Checked in successfully.');


            const appointmentCard = document.querySelector(`.upcoming-appointment[data-appointment-id="${appointmentId}"]`);
            let checkInStatus = appointmentCard.querySelector('.check-in-status');
            if (!checkInStatus) {
                checkInStatus = document.createElement('span');
                checkInStatus.className = 'check-in-status badge badge-success ml-2'; // Using Bootstrap badge for styling
                appointmentCard.querySelector('.card-body').appendChild(checkInStatus); // Assuming .card-body exists
            }
            checkInStatus.textContent = 'You are checked-In for your appointment'; // Update check-in status text
            // Show the check-in success modal
            $('#checkInSuccessModal').modal('show');

            // Optionally, add more visual cues
            appointmentCard.classList.add('border-success');
            // Optionally update the UI here to reflect the check-in
        })
        .catch(error => {
            console.error('Failed to check in:', error);
            alert('Failed to check in.');
        });
}
