// appointmentRoutes.js
const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');

const verifyToken = require('../middleware/verifyTokens');

router.get('/current', verifyToken, appointmentController.getCurrentAppointments);
router.post('/book', verifyToken, appointmentController.bookAppointment);
router.patch('/cancel/:appointmentId', verifyToken, appointmentController.cancelAppointment);

// PATCH request to change the status of an appointment to 'completed'
//router.patch('/complete/:appointmentId', verifyToken, appointmentController.completeAppointment);


module.exports = router;
