const commentController = {};
const Comment = require('../models/Comment');

// Get all comments for a single post
commentController.allComments = async (req, res) => {
  let response = {};
  try {
    let comments = await Comment.find({ post: req.params.id });
    response.success = true;
    response.comments = comments;
    res.json(response);
  } catch (error) {
    response.message = `Server encountered an error while getting the comments ${error}`;
    res.json(response);
  }
};

commentController.submitComment = async (req, res) => {
  let response = {};
  try {
    let comment = new Comment(req.body);
    await comment.save();
    response.message = 'Successfully posted a comment';
    response.success = true;
    response.comment = comment;
    res.json(response);
  } catch (error) {
    response.message = `Server encountered an error while posting a comment ${error}`;
    res.json(response);
  }
};

module.exports = commentController;
