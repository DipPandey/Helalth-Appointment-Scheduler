// chatRoutes.js
const express = require('express');
const router = express.Router();
const chatController  = require('../controllers/chatController');
const rateLimit = require('express-rate-limit');

// Apply rate limiting to the chat route
const apiLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 5, // Limit each IP to 5 requests per windowMs
    message: 'Too many requests from this IP, please try again after a minute',
    headers: true,
});



router.post('/chat', apiLimiter, chatController.getChatResponse);

module.exports = router;
