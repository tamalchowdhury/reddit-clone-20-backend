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

commentController.deleteComment = async (req, res) => {
  // TODO please delete if the user owns the comment
  let response = {};
  try {
    let comment = await Comment.findById(req.params.id);
    if (comment) {
      // Check if the user is admin or owner of the comment
      if (comment.author == req.body._id) {
        await Comment.findByIdAndDelete(req.params.id);
        response.success = true;
        res.json(response);
      } else {
        // You don't own this comment
        response.message = "You can't delete that comment";
        res.json(response);
      }
    } else {
      // No comment found to delete
      response.message = 'No such comment exists to delete';
      res.json(response);
    }
  } catch (error) {
    response.message = `Server encountered an error while deleting a comment ${error}`;
    res.json(response);
  }
};

module.exports = commentController;
