


document.addEventListener('DOMContentLoaded', function () {

    const appointmentsContainer = document.getElementById('appointments-container');

    function loadAppointments() {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found.');
            appointmentsContainer.textContent = 'You must be logged in to see appointments.';
            return;
        }

        fetch('/appointments/current', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
        })
            .then(response => {
                if (!response.ok) {
                    // Log the response status and status text
                    console.error('Failed to load appointments:', response.status, response.statusText);
                    throw new Error(`Server responded with status: ${response.status}`);
                }
                return response.json();
            })
            .then(appointments => {
                console.log('Appointments loaded:', appointments); // Log the appointments array
                displayAppointments(appointments);
            })
            .catch(error => {
                console.error('Failed to load appointments:', error);
                appointmentsContainer.textContent = `Failed to load appointments: ${error.message}`;
            });
    }

   function displayAppointments(appointments) {
    console.log('Displaying appointments...');
    const appointmentsContainer = document.getElementById('appointments-container');
    appointmentsContainer.innerHTML = ''; // Clear the container

    appointments.forEach(appointment => {
        console.log('Appointment:', appointment);
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${appointment.type}</td>
            <td>${new Date(appointment.date).toLocaleDateString()}</td>
            <td>${appointment.time}</td>
            <td>${appointment.duration}</td>
            <td>${appointment.details}</td>
            <td>${appointment.location}</td>
            <td>${appointment.status}</td>
            <td>
                <button class="btn btn-danger cancel-appointment-btn" data-appointment-id="${appointment._id}">
                    Cancel
                </button>
            </td>
        `;

        appointmentsContainer.appendChild(row);
    });

    attachCancelEventListeners();
}

    function attachCancelEventListeners() {
        const cancelButtons = document.querySelectorAll('.cancel-appointment-btn');
        cancelButtons.forEach(button => {
            button.addEventListener('click', function () {
                const appointmentId = this.getAttribute('data-appointment-id');
                // Confirmation dialog
                if (confirm('Are you sure you want to cancel this appointment?')) {
                    cancelAppointment(appointmentId);
                }
            });
        });
    }


    // ... other code ...

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
                    loadAppointments(); // Refresh the list of appointments
                })
                .catch(error => {
                    console.error('Error when attempting to cancel appointment:', error);
                    alert('Error when attempting to cancel appointment: ' + error.message);
                });
        } else {
            console.log('Cancellation aborted by the user.');
        }
    }

    // Attach event listeners dynamically for the 'Cancel' button within the displayAppointments function

    loadAppointments(); // Initial load of appointments
});
