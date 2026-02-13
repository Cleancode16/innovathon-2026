const express = require('express');
const router = express.Router();
const { chatWithStudent } = require('../controllers/chatController');

// POST /api/chat - Send a message and get AI response
router.post('/:userId', chatWithStudent);

module.exports = router;
