const Appointment = require('../models/Appointment');
const { validateAppointment, canCancelAppointment } = require('../utils/validation'); // Assuming you have a validation utility

exports.getCurrentAppointments = async (req, res) => {
    try {
        const patientId = req.user._id; // Assuming you have user data in req.user
        const appointments = await Appointment.find({
            patientId: patientId,
            status: 'scheduled',
            date: { $gte: new Date() } // Only fetch appointments that are scheduled for the future
        });
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving appointments', error: error });
    }
};

exports.bookAppointment = async (req, res) => {
    try {
        const patientId = req.user._id; // Get patient ID from authenticated user session or token
        const { date, time, duration, type, details, location } = req.body;

        //const validation = validateAppointment(req.body);
       // if (!validation.valid) {
       //     return res.status(400).json({ message: validation.message });
        // } 
       //NOTE: come back to this validation as its not currently working

        // Create appointment object
        const newAppointment = new Appointment({
            patientId,
            date,
            time,
            duration,
            type,
            details,
            location,
            // other fields like status can be set by default in your schema
        });

        // Save the new appointment
        await newAppointment.save();
        res.status(201).json({ message: 'Appointment booked successfully', appointment: newAppointment });
    } catch (error) {
        res.status(500).json({ message: 'Error booking appointment', error: error });
    }
};

exports.cancelAppointment = async (req, res) => {
    try {
        const appointmentId = req.params.appointmentId;
        const patientId = req.user._id;

        // Check if the appointment can be cancelled by the user
        const appointment = await Appointment.findById(appointmentId);
        if (!canCancelAppointment(appointment, patientId)) {
            return res.status(403).json({ message: 'Not authorized to cancel this appointment' });
        }

        await Appointment.findByIdAndUpdate(appointmentId, { status: 'cancelled' });
        res.json({ message: 'Appointment cancelled successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error cancelling appointment', error: error });
    }
};
