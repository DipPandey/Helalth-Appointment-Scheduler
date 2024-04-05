const Appointment = require('../models/Appointment');
const mongoose = require('mongoose');


const { canCancelAppointment } = require('../utils/validation');

exports.getCurrentAppointments = async (req, res) => {
    if (!req.user || !req.user._id) {
        console.error('User data not found in request.');
        return res.status(401).json({ message: 'Unauthorized access: No user data.' });
    }

    try {
        const patientId = req.user._id.toString();
        console.log("Fetching appointments for patientId:", patientId);

        if (!mongoose.Types.ObjectId.isValid(patientId)) {
            console.error('Invalid patient ID format.');
            return res.status(400).json({ message: 'Invalid patient ID format.' });
        }

        // We remove the date criteria to fetch all appointments for the patient
        const appointments = await Appointment.find({ patientId: patientId, status: 'scheduled' }).exec();

        // Filter out past appointments if necessary
        const currentAppointments = appointments.filter(appointment => {
            const appointmentDate = new Date(appointment.date);
            return appointmentDate >= new Date();
        });

        console.log("Appointments found:", currentAppointments.length); // Log the number of current appointments found
        currentAppointments.forEach(app => console.log(app)); // Log each appointment object

        res.json(currentAppointments); // Send current appointments
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

// ... other controller functions ...

exports.cancelAppointment = async (req, res) => {
    try {
        const appointmentId = req.params.appointmentId;
        const userId = req.user._id.toString();

        const appointment = await Appointment.findByIdAndUpdate(
            appointmentId,
            { status: 'cancelled' },
            { new: true }
        );
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        // Assuming canCancelAppointment is a utility function you've written
        if (!canCancelAppointment(appointment, userId)) {
            return res.status(403).json({ message: 'Cannot cancel this appointment' });
        }

        // Update the appointment to be 'cancelled'
        appointment.status = 'cancelled';
        await appointment.save();
        console.log("Chosen Appointment cancelled Successfully");
        res.json({ message: 'Appointment cancelled successfully' });
    } catch (error) {
        console.error('Error cancelling appointment:', error);
        res.status(500).json({ message: 'Error cancelling appointment', error });
    }
};






// ... utility functions if not in a separate file ...

