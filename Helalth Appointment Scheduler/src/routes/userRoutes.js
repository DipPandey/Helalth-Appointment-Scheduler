// userRoutes.js
const express = require('express');
const userController = require('../controllers/userController');
const verifyToken = require('../middleware/verifyTokens'); // Adjust the path as necessary
const router = express.Router();

router.get('/profile', verifyToken, userController.getUserProfile);
router.post('/profile/update', verifyToken, userController.updateUserProfile);

module.exports = router;
