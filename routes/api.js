const router = require('express').Router();
const postController = require('../controllers/postController');

// Get all the posts in the app
router.get('/posts', (req, res) => {
  res.json({ message: 'All posts will show up here..' });
});

// Create a new reddit post
// TODO Add validations
// Only allow valid users to be able to post
router.post('/posts/new', postController.submitNewPost);

module.exports = router;
