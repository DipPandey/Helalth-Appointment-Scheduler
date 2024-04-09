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

// appointmentController.js
//funtion to get the upcoming appointments
exports.getUpcomingAppointments = async (req, res) => {
    const patientId = req.user._id;

    try {
        // Fetch all scheduled appointments for the patient
        const allAppointments = await Appointment.find({
            patientId: patientId,
            status: 'scheduled'
        }).sort({ date: 1 }); // Still a good idea to sort them by date

        // Filter appointments to only include those from today onwards
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize today's date to midnight for comparison

        const upcomingAppointments = allAppointments.filter(appointment => {
            const appointmentDate = new Date(appointment.date);
            return appointmentDate >= today;
        });

        res.json(upcomingAppointments);
    } catch (error) {
        console.error('Error retrieving upcoming appointments:', error);
        res.status(500).json({ message: 'Error retrieving upcoming appointments', error });
    }
};

// In appointmentController.js
exports.rescheduleAppointment = async (req, res) => {
    const { appointmentId } = req.params;
    const { newDate, newTime } = req.body; // Expecting new date and time in the request body
    try {
        const updatedAppointment = await Appointment.findByIdAndUpdate(appointmentId,
            { date: newDate, time: newTime },
            { new: true }
        );
        if (!updatedAppointment) {
            return res.status(404).json({ message: 'Appointment not found.' });
        }
        res.json({ message: 'Appointment rescheduled successfully', appointment: updatedAppointment });
    } catch (error) {
        res.status(500).json({ message: 'Error rescheduling appointment', error: error });
    }
};


exports.checkInAppointment = async (req, res) => {
    const { appointmentId } = req.params;
    try {
        const checkedInAppointment = await Appointment.findByIdAndUpdate(appointmentId,
            { checkedIn: true },
            { new: true }
        );
        if (!checkedInAppointment) {
            return res.status(404).json({ message: 'Appointment not found.' });
        }
        res.json({ message: 'Checked-in successfully', appointment: checkedInAppointment });
    } catch (error) {
        res.status(500).json({ message: 'Error checking in', error: error });
    }
};









// ... utility functions if not in a separate file ...

