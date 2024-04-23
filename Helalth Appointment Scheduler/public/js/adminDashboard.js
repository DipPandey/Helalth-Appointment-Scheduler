document.addEventListener('DOMContentLoaded', function () {
    fetchAppointments();
    fetchMedicalRecords();
});

function fetchAppointments() {
    fetch('/api/appointments', {
        headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
    })
        .then(response => response.json())
        .then(appointments => {
            const appointmentsList = document.getElementById('appointments-list');
            appointmentsList.innerHTML = ''; // Clear previous entries
            appointments.forEach(appointment => {
                const div = document.createElement('div');
                div.innerHTML = `
                <h5>${appointment.patientName} (${appointment.patientContact})</h5>
                <p>Appointment on: ${new Date(appointment.date).toLocaleDateString()} at ${appointment.time}</p>
                <p>Duration: ${appointment.duration} minutes</p>
                <p>Status: ${appointment.status}</p>
                <hr>
            `;
                appointmentsList.appendChild(div);
            });
        })
        .catch(error => console.error('Error loading appointments:', error));
}

function fetchMedicalRecords() {
    fetch('/api/medicalRecords', {
        headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
    })
        .then(response => response.json())
        .then(records => {
            const recordsList = document.getElementById('medical-records-list');
            recordsList.innerHTML = ''; // Clear previous entries
            records.forEach(record => {
                const div = document.createElement('div');
                div.innerHTML = `
                <h5>Record for: ${record.patientName}</h5>
                <p>Details: ${record.details}</p>
                <p>Record Date: ${new Date(record.date).toLocaleDateString()}</p>
                <hr>
            `;
                recordsList.appendChild(div);
            });
        })
        .catch(error => console.error('Error loading medical records:', error));
}
