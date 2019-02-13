const Post = require('../models/Post');
const User = require('../models/User');
const config = require('../config');
const jwt = require('jsonwebtoken');
const postController = {};

// GET all the posts in the reddit sub
postController.getAllPosts = async (req, res) => {
  try {
    let posts = await Post.find().limit(25);

    let response = {};
    response.data = posts;
    response.success = true;
    res.json(response);
  } catch (error) {
    res.json({ success: false });
  }
};

// POST to the database
// TODO only allow posting by checking the user token
postController.submitNewPost = async (req, res) => {
  let recievedToken = req.headers.authorization.split(' ')[1];
  let decodedToken = jwt.verify(recievedToken, config.secret);
  let response = {};

  // Check if the token is valid
  if (
    decodedToken._id == req.body.author &&
    decodedToken.exp * 1000 > Date.now()
  ) {
    console.log('Token is valid!');
    // Now check if the user exists and is not banned!
    let checkedUser = await User.findById(req.body.author);
    if (checkedUser && !checkedUser.banned) {
      // Continue checking
      try {
        let post = new Post(req.body);
        await post.save();
        response.data = post;
        response.success = true;
        res.json(response);
      } catch (error) {
        response.success = false;
        response.message = `Could not submit post, check error: ${error}`;
        res.json(response);
      }
    } else {
      response.message = 'You are not allowed to post!';
      res.json(response);
    }
  } else {
    response.message = 'The token is not valid or expired.';
    res.json(response);
  }
};

module.exports = postController;
