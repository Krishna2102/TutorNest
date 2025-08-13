const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  author: {
    type: String,
    required: true,
    trim: true
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'authorModel'
  },
  authorModel: {
    type: String,
    enum: ['Student', 'Teacher']
  },
  text: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['opinion', 'answer'],
    default: 'opinion'
  }
}, { timestamps: true });

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  body: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'authorModel',
    required: true
  },
  authorModel: {
    type: String,
    enum: ['Student', 'Teacher'],
    required: true
  },
  imageUrl: {
    type: String,
    default: ''
  },
  likes: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'likes.userModel'
    },
    userModel: {
      type: String,
      enum: ['Student', 'Teacher']
    }
  }],
  comments: [commentSchema],
  tags: [{
    type: String,
    trim: true
  }]
}, { timestamps: true });

// Virtual for like count
postSchema.virtual('likeCount').get(function() {
  return this.likes.length;
});

// Virtual for comment count
postSchema.virtual('commentCount').get(function() {
  return this.comments.length;
});

// Ensure virtuals are serialized
postSchema.set('toJSON', { virtuals: true });
postSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Post', postSchema);
