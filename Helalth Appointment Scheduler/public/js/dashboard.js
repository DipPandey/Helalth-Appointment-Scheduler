/* global $ */


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

function cancelAppointment(appointmentId) {
    // Display a confirmation dialog
    const isConfirmed = confirm('Do you want to cancel this appointment?');

    // Proceed only if the user confirmed
    if (isConfirmed) {
        // Log for debugging
        console.log('Attempting to cancel appointment:', appointmentId);

        fetch(`/appointments/cancel/${appointmentId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
        })
            .then(response => {
                if (!response.ok) {
                    // Throw an error to be caught in the catch block
                    throw new Error(`Failed to cancel appointment with status: ${response.status}`);
                }
                return response.json();
            })
            .then(() => {
                alert('Appointment cancelled successfully');
                loadUpcomingAppointments();
                $('#cancelConfirmationModal').modal('hide'); // Hide the modal after confirmation
            })
            .catch(error => {
                console.error('Error when attempting to cancel appointment:', error);
                alert('Error when attempting to cancel appointment: ' + error.message);
            });
    } else {
        console.log('Cancellation aborted by the user.');
    }
}

function displayUpcomingAppointments(upcomingAppointments) {
    const upcomingContainer = document.getElementById('upcomingAppointments');
    upcomingContainer.innerHTML = ''; // Clear existing content

    if (upcomingAppointments.length > 0) {
        upcomingAppointments.forEach(appointment => {
            const cardDiv = document.createElement('div');
            cardDiv.className = 'card upcoming-appointment';
            cardDiv.setAttribute('data-appointment-id', appointment._id); // Set data attribute
            cardDiv.innerHTML = `
                <div class="card-body">
                    <h5 class="card-title">${appointment.type}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">${new Date(appointment.date).toLocaleDateString()} at ${appointment.time}</h6>
                    <p class="card-text">Duration: ${appointment.duration}</p>
                    <p class="card-text">Details: ${appointment.details}</p>
                    <p class="card-text">Location: ${appointment.location}</p>
                    <button class="btn btn-outline-primary btn-sm card-link-reschedule" data-id="${appointment._id}">Reschedule</button>
                    <button class="btn btn-outline-danger btn-sm card-link-cancel" data-id="${appointment._id}">Cancel</button>
                    <div class="check-in-status">${appointment.checkedIn ? 'Checked In' : ''}</div> <!-- Check-in status indicator -->
                    <button class="btn btn-outline-success btn-sm card-link-check-in" data-id="${appointment._id}">Check-In Online</button>
                </div>
            `;

            upcomingContainer.appendChild(cardDiv);

            // Attach the reschedule event listener here
            const rescheduleBtn = cardDiv.querySelector('.card-link-reschedule');
            rescheduleBtn.addEventListener('click', function () {
                handleReschedule(this.getAttribute('data-id'));
            });
        });

        

        document.querySelectorAll('.card-link-cancel').forEach(button => {
            button.addEventListener('click', function () {
                const appointmentId = this.getAttribute('data-id');
                $('#cancelConfirmationModal').modal('show'); // Show the modal

                document.getElementById('confirmCancelBtn').onclick = () => {
                    cancelAppointment(appointmentId, () => {
                        // Update the UI to indicate the appointment has been cancelled
                        const appointmentCard = document.querySelector(`.upcoming-appointment[data-appointment-id="${appointmentId}"]`);
                        if (appointmentCard) {
                            // Example: Add a "Cancelled" badge
                            const statusDiv = appointmentCard.querySelector('.check-in-status');
                            if (statusDiv) {
                                statusDiv.innerHTML = '<span class="badge badge-danger">Cancelled</span>';
                            } else {
                                // If there's no status div, create one
                                const newStatusDiv = document.createElement('div');
                                newStatusDiv.className = 'check-in-status';
                                newStatusDiv.innerHTML = '<span class="badge badge-danger">Cancelled</span>';
                                appointmentCard.querySelector('.card-body').appendChild(newStatusDiv);
                            }
                        }

                        $('#cancelConfirmationModal').modal('hide'); // Hide the modal after confirmation
                        
                    });
                };
            });

            
        });


        document.querySelectorAll('.card-link-check-in').forEach(button => {
            button.addEventListener('click', () => handleCheckIn(button.getAttribute('data-id')));
        });

        // Assuming you already have a cancel event handler similar to reschedule and check-in
    } else {
        upcomingContainer.innerHTML = '<p class="text-muted">No upcoming appointments.</p>';
    }
}



function handleReschedule(appointmentId) {
    console.log('Rescheduling appointment:', appointmentId);

    // Show the reschedule modal
    const rescheduleModal = document.getElementById('rescheduleModal');
    rescheduleModal.style.display = 'block';

    // Attach event listeners after elements are added to the DOM
    document.querySelectorAll('.card-link-reschedule').forEach(button => {
        button.addEventListener('click', () => handleReschedule(button.getAttribute('data-id')));
    });

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
                loadUpcomingAppointments();
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


