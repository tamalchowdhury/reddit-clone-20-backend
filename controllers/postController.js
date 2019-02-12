const Post = require('../models/Post');
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
postController.submitNewPost = async (req, res) => {
  let response = {};
  try {
    let post = new Post(req.body);
    await post.save();
    response.data = post;
    response.success = true;
    res.json(response);
  } catch (error) {
    response.success = false;
    res.json(response);
  }
};

module.exports = postController;
