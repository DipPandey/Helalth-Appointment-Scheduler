// appointmentRoutes.js
const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');

const verifyToken = require('../middleware/verifyTokens');

router.get('/current', verifyToken, appointmentController.getCurrentAppointments);
router.post('/book', verifyToken, appointmentController.bookAppointment);
router.patch('/cancel/:appointmentId', verifyToken, appointmentController.cancelAppointment);



module.exports = router;
