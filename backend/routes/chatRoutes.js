const express = require('express');
const router = express.Router();
const { sendMessage, getMessages, getAllChats } = require('../controllers/chat');
// GET /api/chat/all - get all chat messages
router.get('/all', getAllChats);

// POST /api/chat/send - send a message
router.post('/send', sendMessage);

// GET /api/chat/messages?sender=...&receiver=... - get messages between two users
router.get('/messages', getMessages);

module.exports = router;
