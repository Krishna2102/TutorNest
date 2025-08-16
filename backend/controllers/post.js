const Post = require('../models/postModels');
const Student = require('../models/studentModel');
const Teacher = require('../models/teacherModel');

// Get all posts
const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate('authorId', 'fullName')
      .populate('comments.authorId', 'fullName');
    
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
};

// Get single post
const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('authorId', 'fullName')
      .populate('comments.authorId', 'fullName');
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch post' });
  }
};

// Create post
const createPost = async (req, res) => {
  try {
    const { title, body, imageUrl, tags } = req.body;
    
    console.log('Creating post with user:', req.user);
    console.log('User ID:', req.user._id || req.user.id);
    console.log('User role:', req.user.role);
    
    if (!title || !body) {
      return res.status(400).json({ error: 'Title and body are required' });
    }

    // Determine author model based on user role
    const authorModel = req.user.role === 'student' ? 'Student' : 'Teacher';
    
    const post = new Post({
      title,
      body,
      author: req.user.fullName,
      authorId: req.user._id || req.user.id,
      authorModel,
      imageUrl: imageUrl || '',
      tags: tags || []
    });

    console.log('Post object created:', post);
    await post.save();
    
    const populatedPost = await Post.findById(post._id)
      .populate('authorId', 'fullName');
    
    res.status(201).json(populatedPost);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
};

// Update post (only by author)
const updatePost = async (req, res) => {
  try {
    const { title, body, imageUrl, tags } = req.body;
    
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    // Check if user is the author
    if (post.authorId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to edit this post' });
    }
    
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      { title, body, imageUrl, tags },
      { new: true, runValidators: true }
    ).populate('authorId', 'fullName');
    
    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update post' });
  }
};

// Delete post (only by author)
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    // Check if user is the author
    if (post.authorId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to delete this post' });
    }
    
    await Post.findByIdAndDelete(req.params.id);
    
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete post' });
  }
};

// Like/Unlike post
const toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    const userModel = req.user.role === 'student' ? 'Student' : 'Teacher';
    const existingLike = post.likes.find(
      like => like.userId.toString() === req.user.id && like.userModel === userModel
    );
    
    if (existingLike) {
      // Unlike
      post.likes = post.likes.filter(
        like => !(like.userId.toString() === req.user.id && like.userModel === userModel)
      );
    } else {
      // Like
      post.likes.push({
        userId: req.user.id,
        userModel
      });
    }
    
    await post.save();
    
    res.status(200).json({ 
      message: existingLike ? 'Post unliked' : 'Post liked',
      likeCount: post.likes.length,
      isLiked: !existingLike
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle like' });
  }
};

// Add comment
const addComment = async (req, res) => {
  try {
    const { text, type } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Comment text is required' });
    }
    
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    const userModel = req.user.role === 'student' ? 'Student' : 'Teacher';
    
    const comment = {
      author: req.user.fullName,
      authorId: req.user.id,
      authorModel: userModel,
      text,
      type: type || 'opinion'
    };
    
    post.comments.push(comment);
    await post.save();
    
    const populatedPost = await Post.findById(post._id)
      .populate('authorId', 'fullName')
      .populate('comments.authorId', 'fullName');
    
    res.status(201).json(populatedPost);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add comment' });
  }
};

// Delete comment (only by comment author or post author)
const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    const comment = post.comments.id(commentId);
    
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    
    // Check if user is the comment author or post author
    const isCommentAuthor = comment.authorId.toString() === req.user.id;
    const isPostAuthor = post.authorId.toString() === req.user.id;
    
    if (!isCommentAuthor && !isPostAuthor) {
      return res.status(403).json({ error: 'Not authorized to delete this comment' });
    }
    
    comment.remove();
    await post.save();
    
    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete comment' });
  }
};

// Get user's posts
const getUserPosts = async (req, res) => {
  try {
    const posts = await Post.find({ authorId: req.user.id })
      .sort({ createdAt: -1 })
      .populate('authorId', 'fullName');
    
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user posts' });
  }
};

module.exports = {
  getAllPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  toggleLike,
  addComment,
  deleteComment,
  getUserPosts
};
