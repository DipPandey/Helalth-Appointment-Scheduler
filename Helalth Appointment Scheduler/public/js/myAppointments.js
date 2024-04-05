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
        console.log('Displaying appointments...'); // Log that we are about to display appointments
        appointmentsContainer.innerHTML = ''; // Clear the container
        appointments.forEach(appointment => {
            console.log('Appointment:', appointment); // Log each individual appointment
            const appointmentElement = document.createElement('div');
            appointmentElement.className = 'appointment';
            appointmentElement.innerHTML = `
                <h3>${appointment.type}</h3>
            <p>Date: ${new Date(appointment.date).toLocaleDateString()}</p>
            <p>Time: ${appointment.time}</p>
            <p>Duration: ${appointment.duration}</p>
            <p>Details: ${appointment.details}</p>  <!-- Add this line -->
            <p>Location: ${appointment.location}</p>  <!-- Add this line -->
            <p>Status: ${appointment.status}</p>
            <button class="cancel-appointment-btn" data-appointment-id="${appointment._id}">Cancel</button>
        `;
            appointmentsContainer.appendChild(appointmentElement);
        });

        attachCancelEventListeners(); // Attach event listeners after appointments have been displayed
    }

    function attachCancelEventListeners() {
        console.log('Attaching cancel event listeners...'); // Log that we are about to attach event listeners
        const cancelButtons = document.querySelectorAll('.cancel-appointment-btn');
        cancelButtons.forEach(button => {
            button.addEventListener('click', function () {
                const appointmentId = this.getAttribute('data-appointment-id');
                cancelAppointment(appointmentId);
            });
        });
    }

    // ... other code ...

    function cancelAppointment(appointmentId) {
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
    }


    loadAppointments(); // Initial load of appointments
});
