// utils/validation.js

// Function to validate the appointment input data
function validateAppointment(appointmentData) {
    const errors = [];
    const { date, time, duration, type, details, location } = appointmentData;
    const appointmentDateTime = new Date(`${date}T${time}`);

    
    // Check for valid duration
    if (!duration || Number(duration) <= 0) {
        errors.push('Invalid duration specified.');
    }
    // Check for a valid type
    if (!type || type.trim() === '') {
        errors.type = 'Appointment type is required.';
    }

    // Check for valid details
    if (!details || details.trim() === '') {
        errors.details = 'Appointment details are required.';
    }

    // Check for a valid location
    if (!location || location.trim() === '') {
        errors.location = 'Appointment location is required.';
    }


    if (appointmentDateTime < new Date()) {
        errors.push('Appointments must be scheduled for a future date and time.');
    }

    return {
        valid: errors.length === 0,
        message: errors.join(' '),
    };
}

// Function to check if the appointment can be canceled
function canCancelAppointment(appointment, patientId) {
    // Assuming appointment is a document from MongoDB with patientId and date as fields
    if (appointment.patientId.toString() !== patientId) {
        return false;
    }

    // Assume you can only cancel appointments more than 24 hours in advance
    const oneDayFromNow = new Date(new Date().getTime() + (24 * 60 * 60 * 1000));
    return new Date(appointment.date) > oneDayFromNow;
}

module.exports = {
    validateAppointment,
    canCancelAppointment,
};
