// Get all chat messages in the system
exports.getAllChats = async (req, res) => {
	try {
		const chats = await Chat.find().sort({ createdAt: -1 });
		res.json(chats);
	} catch (err) {
		res.status(500).json({ error: 'Failed to fetch all chats' });
	}
};
const Chat = require('../models/chatModel');

// Send a message
exports.sendMessage = async (req, res) => {
	try {
		const { sender, receiver, message } = req.body;
		const chat = new Chat({ sender, receiver, message });
		await chat.save();
		res.status(201).json(chat);
	} catch (err) {
		res.status(500).json({ error: 'Failed to send message' });
	}
};

// Get all messages between two users
exports.getMessages = async (req, res) => {
	try {
		const { sender, receiver } = req.query;
		const messages = await Chat.find({
			$or: [
				{ sender, receiver },
				{ sender: receiver, receiver: sender }
			]
		}).sort({ sentAt: 1 });
		res.json(messages);
	} catch (err) {
		res.status(500).json({ error: 'Failed to fetch messages' });
	}
};
