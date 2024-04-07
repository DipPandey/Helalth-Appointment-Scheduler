

document.addEventListener('DOMContentLoaded', function () {
    // Toggles the edit profile form visibility
    document.getElementById('toggleEditForm').addEventListener('click', function () {
        const editForm = document.getElementById('editProfile');
        editForm.style.display = editForm.style.display === 'none' ? 'block' : 'none';
    });
    //using the login name as welcome message
    const userName = localStorage.getItem('name');
    if (userName) {
        // Update the welcome message with the user's name
        document.querySelector('.user-profile h3').textContent = `Welcome, ${userName}`;
    }


    // Fetches user profile data from the server
    function loadUserProfile() {
        fetch('/user/profile', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
                // Include authorization headers 
            },
        })
            .then(response => response.json())
            .then(data => {
                console.log('User data:', data);
                console.log(data); 
                document.getElementById('editName').value = data.name;
                document.getElementById('editEmail').value = data.email;
                // Update the welcome message with the user's name
                document.querySelector('.user-profile h3').textContent = `Welcome, ${data.name}`;
            })
            .catch(error => console.error('Failed to load user profile', error));
    }

    // Submits the updated user profile data to the server
    document.getElementById('editProfileForm').addEventListener('submit', function (event) {
        event.preventDefault();
        const updatedName = document.getElementById('editName').value;
        const updatedEmail = document.getElementById('editEmail').value;

        console.log('Token:', localStorage.getItem('token'));

        fetch('/user/profile/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
                // Include authorization headers if needed
            },
            body: JSON.stringify({ name: updatedName, email: updatedEmail }),
        })
            .then(response => {
                if (!response.ok) throw new Error('Profile update failed');
                return response.json();
            })
            .then(() => {
                alert('Profile updated successfully');
                // Refresh user profile data to reflect updates
                loadUserProfile();
                // Optionally hide the edit form after successful update
                document.getElementById('editProfile').style.display = 'none';
            })
            .catch(error => {
                console.error('Failed to update profile', error);
                alert(error.message);
            });
    });

    loadUpcomingAppointments(); // This wi
    

});

// Function to fetch and display upcoming appointments
function loadUpcomingAppointments() {
    fetch('/appointments/upcoming', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
        },
    })
        .then(response => {
            if (!response.ok) throw new Error('Failed to fetch upcoming appointments');
            return response.json();
        })
        .then(upcomingAppointments => {
            displayUpcomingAppointments(upcomingAppointments);
        })
        .catch(error => console.error('Error fetching upcoming appointments:', error));
}

function displayUpcomingAppointments(upcomingAppointments) {
    const upcomingContainer = document.getElementById('upcomingAppointments');
    upcomingContainer.innerHTML = ''; // Clear existing content

    if (upcomingAppointments.length > 0) {
        upcomingAppointments.forEach(appointment => {

            
            const cardDiv = document.createElement('div');
            cardDiv.className = 'card upcoming-appointment';
            cardDiv.innerHTML = `
                <div class="card-body">
                    <h5 class="card-title">${appointment.type}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">${new Date(appointment.date).toLocaleDateString()} at ${appointment.time}</h6>
                    <p class="card-text">Duration: ${appointment.duration}</p>
                    <p class="card-text">Details: ${appointment.details}</p>
                    <p class="card-text">Location: ${appointment.location}</p>
                    <button class="btn btn-outline-primary btn-sm card-link-reschedule" data-id="${appointment._id}">Reschedule</button>
                    <button class="btn btn-outline-danger btn-sm card-link-cancel" data-id="${appointment._id}">Cancel</button>
                    <button class="btn btn-outline-success btn-sm card-link-check-in" data-id="${appointment._id}">Check-In Online</button>
                </div>


            `;
            // Attach event listeners for new buttons
            const rescheduleBtn = cardDiv.querySelector('.card-link-reschedule');

            const checkInBtn = cardDiv.querySelector('.card-link-check-in');

            rescheduleBtn.addEventListener('click', () => handleReschedule(appointment._id));

            checkInBtn.addEventListener('click', () => handleCheckIn(appointment._id));

            upcomingContainer.appendChild(cardDiv);
        });
    } else {
        upcomingContainer.innerHTML = '<p class="text-muted">No upcoming appointments.</p>';
    }
}

function handleReschedule(appointmentId) {
    console.log('Rescheduling appointment:', appointmentId);

    // Show the reschedule modal
    const rescheduleModal = document.getElementById('rescheduleModal');
    rescheduleModal.style.display = 'block';

    // When the user submits the new date/time
    document.getElementById('rescheduleForm').onsubmit = (e) => {
        e.preventDefault();

        // Get the new date and time from the form
        const newDate = document.getElementById('newDateInput').value;
        const newTime = document.getElementById('newTimeInput').value;

        // Close the modal
        rescheduleModal.style.display = 'none';

        // Make an API call to reschedule
        fetch(`/appointments/reschedule/${appointmentId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            },
            body: JSON.stringify({ newDate, newTime }),
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                alert('Appointment rescheduled successfully.');
                // Refresh the appointments list here
            })
            .catch(error => {
                console.error('Failed to reschedule appointment:', error);
                alert('Failed to reschedule appointment.');
            });
    };
}

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
            // Optionally update the UI here to reflect the check-in
        })
        .catch(error => {
            console.error('Failed to check in:', error);
            alert('Failed to check in.');
        });
}


