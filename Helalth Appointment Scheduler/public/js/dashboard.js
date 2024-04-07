

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
                    <a href="#" class="card-link">Reschedule</a>
                    <a href="myAppointments.html" class="card-link">Cancel</a>
                    <a href="" class="card-link">Check-In online</a>
                </div>
            `;
            upcomingContainer.appendChild(cardDiv);
        });
    } else {
        upcomingContainer.innerHTML = '<p class="text-muted">No upcoming appointments.</p>';
    }
}

