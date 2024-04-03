// appointmentRoutes.js
const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');

router.get('/current', appointmentController.getCurrentAppointments);
// appointmentRoutes.js
router.post('/book', appointmentController.bookAppointment);
// appointmentRoutes.js
router.patch('/cancel/:appointmentId', appointmentController.cancelAppointment);


module.exports = router;
