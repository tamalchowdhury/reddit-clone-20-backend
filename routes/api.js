const router = require('express').Router();
const postController = require('../controllers/postController');
const userController = require('../controllers/userController');
const commentController = require('../controllers/commentController');

// Get all the posts in the app
router.get('/posts/all', postController.getAllPosts);

router.get('/posts/:skip/:page', postController.getNextPosts);

// Get a single post and comments
router.get('/post/:id/single', postController.getSinglePostAndComments);

// Get all the posts by the user
router.get('/user/:username/posts', postController.getAllPostsByUser);

// Register user
// TODO Validate the user registration info
// Issue a new token and send it to the client
router.post(
  '/register',
  userController.validateRegInfo,
  userController.register
);

// Login api
router.post('/login', userController.validateLoginInfo, userController.login);

// Create a new reddit post
// TODO Add validations
// Only allow valid users to be able to post
router.post(
  '/posts/new',
  postController.verifyToken,
  postController.submitNewPost
);

// Upvote a post
router.put(
  '/post/:id/upvote',
  postController.verifyToken,
  postController.upvote
);

// Downvote a post
router.put(
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

// Get all comments
router.get('/post/:id/comments/all', commentController.allComments);

// Post a comment
router.post(
  '/post/:id/comment',
  postController.verifyToken,
  commentController.submitComment
);

// Delete a comment
router.delete(
  '/post/:id/comment',
  postController.verifyToken,
  commentController.deleteComment
);

// Upvote a comment
router.put(
  '/comment/:id/upvote',
  postController.verifyToken,
  commentController.upvote
);

// Downvote a comment
router.put(
  '/comment/:id/downvote',
  postController.verifyToken,
  commentController.downvote
);

// Admin Actions
// Possible actions:
// BAN, UNBAN, MAKEADMIN, REMOVEADMIN
// Why not do all of them with one controller
router.post(
  '/user/:username/action/:action',
  postController.verifyToken,
  userController.adminAction
);

// Delete a user
router.delete(
  '/user/:username',
  postController.verifyToken,
  userController.deleteUser
);

module.exports = router;
