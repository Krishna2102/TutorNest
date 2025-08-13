const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
	sender: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Student',
		required: true,
	},
	receiver: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Teacher',
		required: true,
	},
	message: {
		type: String,
		required: true,
	},
	sentAt: {
		type: Date,
		default: Date.now,
	},
}, { timestamps: true });

module.exports = mongoose.model('Chat', chatSchema);
