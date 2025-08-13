const express = require('express');
const { auth } = require('../middleware/authMiddleware');
const {
  getAllPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  toggleLike,
  addComment,
  deleteComment,
  getUserPosts
} = require('../controllers/post');

const router = express.Router();

// Public routes
router.get('/', getAllPosts);
router.get('/:id', getPost);

// Protected routes
router.use(auth);

router.post('/', createPost);
router.put('/:id', updatePost);
router.delete('/:id', deletePost);
router.post('/:id/like', toggleLike);
router.post('/:id/comments', addComment);
router.delete('/:id/comments/:commentId', deleteComment);
router.get('/user/me', getUserPosts);

module.exports = router;
