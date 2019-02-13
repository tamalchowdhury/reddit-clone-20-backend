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
router.post('/posts/new', postController.submitNewPost);

// Upvote a post
router.post('/post/:id/upvote', postController.upvote);

module.exports = router;
