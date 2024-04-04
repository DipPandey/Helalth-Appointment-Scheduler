document.addEventListener('DOMContentLoaded', function () {

    // Function to load current user's appointments
    function loadAppointments() {
        fetch('/appointments/current', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token') // Include the auth token from localStorage
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok.');
                }
                return response.json();
            })
            .then(appointments => {
                // Render appointments to the page
                console.log('Current appointments:', appointments);
                displayAppointments(appointments);
            })
            .catch(error => {
                console.error('Failed to load appointments:', error);
            });
    }

    // Function to display appointments on the page
    function displayAppointments(appointments) {
        const appointmentsContainer = document.getElementById('appointments-container'); // Replace with your actual container ID
        // Clear existing appointments
        appointmentsContainer.innerHTML = '';

        // Create HTML for each appointment and append to the container
        appointments.forEach(appointment => {
            const appointmentElement = document.createElement('div');
            // Add class for styling if needed
            appointmentElement.className = 'appointment';
            appointmentElement.innerHTML = `
                <h3>${appointment.type}</h3>
                <p>Date: ${new Date(appointment.date).toLocaleDateString()}</p>
                <p>Time: ${appointment.time}</p>
                <p>Duration: ${appointment.duration}</p>
                <p>Status: ${appointment.status}</p>
                <button onclick="cancelAppointment('${appointment._id}')">Cancel</button>
            `;
            appointmentsContainer.appendChild(appointmentElement);
        });
    }

    // Function to cancel an appointment
    window.cancelAppointment = function (appointmentId) {
        fetch(`/appointments/cancel/${appointmentId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token') // Include the auth token from localStorage
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok.');
                }
                return response.json();
            })
            .then(() => {
                console.log('Appointment cancelled successfully');
                loadAppointments(); // Reload appointments to update the list
            })
            .catch(error => {
                console.error('Failed to cancel appointment:', error);
            });
    }

    // Initial load of appointments
    loadAppointments();
});
