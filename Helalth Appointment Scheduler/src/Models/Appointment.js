const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    appointmentId: String,
    patientId: String,
    doctorId: String,
    time: String,
    date: String,
    duration: String,
    status: {
        type: String,
        enum: ['scheduled', 'cancelled', 'completed'],
        default: 'scheduled'
    },
    type: String,
    details: String,
    createdAt: Date,
    updatedAt: Date,
    reminderSent: Boolean,
    location: String
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;
