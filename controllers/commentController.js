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

commentController.upvote = async (req, res) => {
  let upvotedbyId = req.body._id;
  let commentId = req.params.id;
  let response = {};
  try {
    // 1. Find the given comment
    // 2. add the upvote to the comment
    let comment = await Comment.findById(commentId);
    if (comment) {
      let allUpvotes = comment.upvotedby.map((obj) => obj.toString());
      let operator = allUpvotes.includes(upvotedbyId) ? '$pull' : '$addToSet';

      // Add/Remove that upvote to the post
      let updatedComment = await Comment.findByIdAndUpdate(
        commentId,
        {
          [operator]: { upvotedby: upvotedbyId }
        },
        { new: true }
      );
      // Send the updated comment back to the client for storing & display
      response.success = true;
      response.comment = updatedComment;
      res.json(response);
    } else {
      response.message = `The comment does not exists`;
      res.json(response);
    }
  } catch (error) {
    response.message = `Server encountered an error while upvoting a comment ${error}`;
    res.json(response);
  }
};

commentController.downvote = async (req, res) => {};

module.exports = commentController;
