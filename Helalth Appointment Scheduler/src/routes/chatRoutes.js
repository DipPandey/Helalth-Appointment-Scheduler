// chatRoutes.js
const express = require('express');
const router = express.Router();
const { getChatResponse } = require('../controllers/chatController');

router.post('/chat', getChatResponse);

module.exports = router;
