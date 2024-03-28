const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController'); // Adjust path as needed

// POST route for user login
router.post('/login', authController.login);

// POST route for user registration/signup
router.post('/signup', authController.signup);

module.exports = router;
