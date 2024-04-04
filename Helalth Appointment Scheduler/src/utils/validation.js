// utils/validation.js

/**
 * Validates the appointment data.
 * @param {Object} appointmentData - The appointment details to validate.
 * @returns {Object} - An object indicating whether the data is valid, and if not, a message why.
 */
const validateAppointment = (appointmentData) => {
    const { date, time, duration, type, details, location } = appointmentData;
    const appointmentDateTime = new Date(`${date}T${time}`);

    // Add your custom validation logic here.
    // For example, check if 'duration' is a positive number, 'type' is not empty, etc.
    if (!duration || isNaN(Number(duration)) || Number(duration) <= 0) {
        return { valid: false, message: 'Invalid duration specified.' };
    }

    if (!type || type.trim().length === 0) {
        return { valid: false, message: 'Appointment type cannot be empty.' };
    }

    if (!details || details.trim().length === 0) {
        return { valid: false, message: 'Appointment details cannot be empty.' };
    }

    if (!location || location.trim().length === 0) {
        return { valid: false, message: 'Appointment location cannot be empty.' };
    }

    // Ensure the appointment is at least one day in the future
    const oneDayFromNow = new Date();
    oneDayFromNow.setDate(oneDayFromNow.getDate() + 1);
    if (appointmentDateTime < oneDayFromNow) {
        return { valid: false, message: 'Appointments must be scheduled at least one day in advance.' };
    }

    // Check for valid duration, type, details, and location
    // ... Additional validation logic goes here

    return { valid: true };
};

/**
 * Determines if an appointment can be canceled.
 * @param {Date} appointmentDate - The date and time of the appointment.
 * @param {string} patientId - The ID of the patient who booked the appointment.
 * @param {string} userId - The ID of the user attempting to cancel the appointment.
 * @returns {boolean} - True if the appointment can be canceled; false otherwise.
 */
const canCancelAppointment = (appointmentDate, patientId, userId) => {
    // Check if the user requesting the cancellation is the one who booked the appointment
    if (patientId !== userId) {
        return false;
    }

    // Check if the appointment is more than one hour away
    const oneHourFromNow = new Date();
    oneHourFromNow.setHours(oneHourFromNow.getHours() + 1);
    return appointmentDate > oneHourFromNow;
};

module.exports = {
    validateAppointment,
    canCancelAppointment
};
