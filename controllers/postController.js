const Post = require('../models/Post');
const postController = {};

postController.submitNewPost = async (req, res) => {
  try {
    let post = new Post(req.body);
    await post.save();
    res.json({ success: true });
  } catch (error) {
    res.json({ success: false });
  }
};

module.exports = postController;
