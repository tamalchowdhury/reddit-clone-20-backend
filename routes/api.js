const router = require('express').Router();
const postController = require('../controllers/postController');
const userController = require('../controllers/userController');

// Get all the posts in the app
router.get('/posts/all', postController.getAllPosts);

// Register user
// TODO Validate the user registration info
// Issue a new token and send it to the client
router.post('/register', userController.register);

// Login api
router.post('/login', userController.login);

// Create a new reddit post
// TODO Add validations
// Only allow valid users to be able to post
router.post(
  '/posts/new',
  postController.verifyToken,
  postController.submitNewPost
);

// Upvote a post
router.post(
  '/post/:id/upvote',
  postController.verifyToken,
  postController.upvote
);

// Downvote a post
router.post(
  '/post/:id/downvote',
  postController.verifyToken,
  postController.downvote
);

// Delete a post
router.delete(
  '/post/:id/delete',
  postController.verifyToken,
  postController.deletePost
);

module.exports = router;
