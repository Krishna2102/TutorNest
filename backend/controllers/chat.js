const Chat = require('../models/chatModel');

// Get all chat messages in the system
exports.getAllChats = async (req, res) => {
	try {
		const chats = await Chat.find().sort({ createdAt: -1 });
		res.json(chats);
	} catch (err) {
		res.status(500).json({ error: 'Failed to fetch all chats' });
	}
};

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

// Get user information for chat participants
exports.getUserInfo = async (req, res) => {
	try {
		const { userId } = req.params;
		
		// Try to find user in Student collection first
		const Student = require('../models/studentModel');
		let user = await Student.findById(userId).select('fullName email');
		
		if (!user) {
			// Try Teacher collection
			const Teacher = require('../models/teacherModel');
			user = await Teacher.findById(userId).select('fullName email');
		}
		
		if (user) {
			res.json({ success: true, user });
		} else {
			res.status(404).json({ success: false, error: 'User not found' });
		}
	} catch (err) {
		res.status(500).json({ success: false, error: 'Failed to fetch user info' });
	}
};
