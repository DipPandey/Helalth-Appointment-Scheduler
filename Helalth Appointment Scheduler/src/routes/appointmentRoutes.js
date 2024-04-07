// appointmentRoutes.js
const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');

const verifyToken = require('../middleware/verifyTokens');

router.get('/current', verifyToken, appointmentController.getCurrentAppointments);
router.post('/book', verifyToken, appointmentController.bookAppointment);
router.patch('/cancel/:appointmentId', verifyToken, appointmentController.cancelAppointment);
// At the top of the file where other routes are defined
router.get('/upcoming', verifyToken, appointmentController.getUpcomingAppointments);
router.patch('/reschedule/:appointmentId', verifyToken, appointmentController.rescheduleAppointment);
// In appointmentRoutes.js
router.patch('/check-in/:appointmentId', verifyToken, appointmentController.checkInAppointment);


// PATCH request to change the status of an appointment to 'completed'
//router.patch('/complete/:appointmentId', verifyToken, appointmentController.completeAppointment);


module.exports = router;
