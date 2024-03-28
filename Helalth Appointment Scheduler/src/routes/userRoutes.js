const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController'); // Adjust path as necessary

//Get and POST for userController
router.get('/profile', userController.getUserProfile);
router.post('/profile/update', userController.updateUserProfile);

module.exports = router;
