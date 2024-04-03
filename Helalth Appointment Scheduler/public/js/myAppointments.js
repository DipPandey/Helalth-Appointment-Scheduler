// myAppointments.js
document.addEventListener('DOMContentLoaded', function () {
    const appointmentsContainer = document.getElementById('appointments-container');

    function loadAppointments() {
        // Replace with your actual endpoint
        fetch('/user/appointments/current', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
            .then(response => response.json())
            .then(appointments => {
                appointmentsContainer.innerHTML = ''; // Clear the container
                appointments.forEach(appointment => {
                    const appointmentEl = document.createElement('div');
                    appointmentEl.className = 'appointment';
                    appointmentEl.innerHTML = `
                    <h5>${appointment.type}</h5>
                    <p>Date: ${appointment.date} at ${appointment.time}</p>
                    <p>Duration: ${appointment.duration}</p>
                    <p>Location: ${appointment.location}</p>
                    <p>Status: ${appointment.status}</p>
                    <button onclick="cancelAppointment('${appointment._id}')">Cancel</button>
                `;
                    appointmentsContainer.appendChild(appointmentEl);
                });
            })
            .catch(error => console.error('Error loading appointments:', error));
    }

    window.cancelAppointment = function (appointmentId) {
        // Replace with your actual endpoint
        fetch(`/appointments/cancel/${appointmentId}`, {
            method: 'PATCH',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
            .then(response => {
                if (!response.ok) throw new Error('Failed to cancel appointment');
                return response.json();
            })
            .then(() => {
                alert('Appointment cancelled successfully');
                loadAppointments(); // Reload appointments
            })
            .catch(error => alert('Error cancelling appointment: ' + error.message));
    };

    // Initial load of appointments
    loadAppointments();
});
