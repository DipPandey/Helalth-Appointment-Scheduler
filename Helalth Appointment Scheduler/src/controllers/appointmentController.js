// appointmentController.js
const Appointment = require('../models/Appointment');

exports.getCurrentAppointments = async (req, res) => {
    try {
        // You need to get the patientId from the token or session
        const patientId = req.patientId;
        const appointments = await Appointment.find({ patientId: patientId, status: 'scheduled' });
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving appointments' });
    }
};

// appointmentController.js
exports.bookAppointment = async (req, res) => {
    try {
        const newAppointment = new Appointment(req.body);
        await newAppointment.save();
        res.status(201).json({ message: 'Appointment booked successfully', appointment: newAppointment });
    } catch (error) {
        res.status(500).json({ message: 'Error booking appointment' });
    }
};

// appointmentController.js
exports.cancelAppointment = async (req, res) => {
    try {
        const appointmentId = req.params.appointmentId;
        await Appointment.findByIdAndUpdate(appointmentId, { status: 'cancelled' });
        res.json({ message: 'Appointment cancelled successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error cancelling appointment' });
    }
};
