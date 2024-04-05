document.addEventListener('DOMContentLoaded', function () {
    const bookingForm = document.getElementById('bookingForm');

    bookingForm.addEventListener('submit', function (event) {
        event.preventDefault();

        // Gather form data into an object
        const formData = {
            date: document.getElementById('appointmentDate').value,
            time: document.getElementById('appointmentTime').value,
            duration: document.getElementById('appointmentDuration').value,
            type: document.getElementById('appointmentType').value,
            details: document.getElementById('appointmentDetails').value,
            location: document.getElementById('appointmentLocation').value
            // patientId and doctorId should be handled server-side or added here if available on the client
        };

        // Post the form data to the server
        fetch('/appointments/book', { // Replace '/api/appointments/book' with your actual endpoint
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token') // Include the auth token from localStorage
            },
            body: JSON.stringify(formData)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok.');
                }
                return response.json();
            })
            .then(data => {
                // Handle success response, such as redirecting to the appointments page or displaying a success message
                console.log('Appointment booked successfully:', data);
                // Redirect to the myAppointments page or display success message
                window.location.href = '/myAppointments';
            })
            .catch(error => {
                // Handle errors, such as displaying an error message to the user
                console.error('There was a problem with your booking:', error);
                alert('Failed to book appointment: ' + error.message);
            });
    });
});
