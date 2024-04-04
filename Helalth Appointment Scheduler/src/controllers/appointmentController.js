const Appointment = require('../models/Appointment');
const mongoose = require('mongoose');


const { validateAppointment, canCancelAppointment } = require('../utils/validation'); // Assuming you have a validation utility

exports.getCurrentAppointments = async (req, res) => {
    // Ensure that we have user data in req.user
    if (!req.user || !req.user._id) {
        console.error('User data not found in request.');
        return res.status(401).json({ message: 'Unauthorized access: No user data.' });
    }

    try {
        const patientId = req.user._id;
        console.log("Fetching appointments for patientId:", patientId); // For debugging

        // Ensure that patientId is in the right format (e.g., a MongoDB ObjectId)
        if (!mongoose.Types.ObjectId.isValid(patientId)) {
            console.error('Invalid patient ID format.');
            return res.status(400).json({ message: 'Invalid patient ID format.' });
        }

        const appointments = await Appointment.find({
            patientId: patientId,
            status: 'scheduled',
            date: { $gte: new Date() }
        }).exec(); // Adding exec() to get a full promise back

        console.log("Appointments found:", appointments); // For debugging
        res.json(appointments);
    } catch (error) {
        console.error('Error retrieving appointments:', error);
        res.status(500).json({ message: 'Error retrieving appointments', error });
    }
};

exports.bookAppointment = async (req, res) => {
    try {
        const patientId = req.user._id; // Get patient ID from authenticated user session or token
        const { date, time, duration, type, details, location } = req.body;

        //const validation = validateAppointment(req.body);
        //if (!validation.valid) {
         //  return res.status(400).json({ message: validation.message });
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
