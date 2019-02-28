const Post = require('../models/Post');
const User = require('../models/User');
const Comment = require('../models/Comment');
const config = require('../config');
const helpers = require('../helpers/helpers');
const jwt = require('jsonwebtoken');
const postController = {};

// Verify token middleware
postController.verifyToken = async (req, res, next) => {
  let response = {};
  try {
    let recievedToken = req.headers.authorization.split(' ')[1];
    let decodedToken = jwt.verify(recievedToken, config.secret);

    // Check if the token is valid
    if (decodedToken.exp * 1000 > Date.now()) {
      let validUser = await User.findById(decodedToken._id);
      if (validUser && !validUser.banned) {
        next();
      } else {
        response.message = 'The user is not valid or banned!';
        response.tokenExpired = true;
        res.json(response);
      }
    } else {
      response.message = 'The token is not valid or expired!';
      response.tokenExpired = true;
      res.json(response);
    }
  } catch (error) {
    response.message = `There was an error with checking the token ${error}`;
    response.tokenExpired = true;
    res.json(response);
  }
};

postController.checkIfUserExistsAndIsNotBanned = async (req, res, next) => {
  let response = {};
  try {
    let checkedUser = await User.findById(req.body.author);
    if (checkedUser && !checkedUser.banned) {
      next();
    } else {
      response.message = 'You are not authorized to take this action!';
      res.json(response);
    }
  } catch (error) {
    response.message = `Something went wrong trying to check the user ${error}`;
    res.json(response);
  }
};

// GET all the posts in the reddit sub
postController.getAllPosts = async (req, res) => {
  let response = {};
  try {
    let posts = await Post.find()
      .sort({ score: -1 })
      .limit(50);
    response.data = posts;
    response.success = true;
    res.json(response);
  } catch (error) {
    response.message = 'Error getting the next posts';
    res.json(response);
  }
};

postController.getNextPosts = async (req, res) => {
  let response = {};
  try {
    let { skip, page } = req.params;
    parseInt(skip);
    parseInt(page);
    let skipBy = skip * page;
    let posts = await Post.find()
      .sort({ score: -1 })
      .skip(skipBy)
      .limit(50);
    response.posts = posts;
    response.success = true;
    res.json(response);
  } catch (error) {
    response.message = `Error getting the next posts ${error}`;
    res.json(response);
  }
};

// POST to the database
// TODO only allow posting by checking the user token
postController.submitNewPost = async (req, res) => {
  let response = {};
  try {
    let { title, text } = req.body;
    req.body.title = helpers.spamFilter(title);
    req.body.text = helpers.spamFilter(text);

    if (req.body.title) {
      let post = new Post(req.body);
      post.upvotedby = req.body.author;
      await post.save();

      // Also add this post to user upvotes
      let user = await User.findByIdAndUpdate(
        { _id: req.body.author },
        {
          $addToSet: { upvotes: post._id }
        },
        { new: true }
      );

      // TODO Delete the sensitive info from user

      response.post = post;
      response.user = helpers.stripTheUserData(user);
      response.success = true;
      res.json(response);
    } else {
      response.message = `Could not submit post`;
      res.json(response);
    }
  } catch (error) {
    response.message = `Could not submit post, check error: ${error}`;
    res.json(response);
  }
};

postController.getSinglePostAndComments = async (req, res) => {
  let response = {};
  try {
    // Find the post
    let post = await Post.findById(req.params.id);
    if (post) {
      // Find all the comments
      let comments = await Comment.find({ post: req.params.id }).sort({
        score: -1
      });
      response.success = true;
      response.post = post;
      response.comments = comments;
      res.json(response);
    } else {
      response.message = 'No posts found';
      res.json(response);
    }
  } catch (error) {
    response.message = `Could not get the post, check error: ${error}`;
    res.json(response);
  }
};

postController.upvote = async (req, res) => {
  let response = {};
  try {
    let postId = req.params.id;
    let userId = req.body.userId;
    // Check if the user is not banned
    let user = await User.findById(userId);
    // Continue if the user is not banned
    if (user && !user.banned) {
      // Find the post to be upvoted
      let post = await Post.findById(postId);
      if (post) {
        let allUpvotes = post.upvotedby.map((obj) => obj.toString());
        let allDownvotes = post.downvotedby.map((obj) => obj.toString());
        let operator = allUpvotes.includes(userId) ? '$pull' : '$addToSet';

        // Add or remove the upvote from the post
        let updatedPost = await Post.findByIdAndUpdate(
          postId,
          {
            [operator]: { upvotedby: userId }
          },
          { new: true }
        );
        // If the post was already downvoted, then remove the downvote
        if (allDownvotes.includes(userId)) {
          updatedPost = await Post.findByIdAndUpdate(
            postId,
            {
              $pull: { downvotedby: userId }
            },
            { new: true }
          );
        }

        // Now update the score
        let score =
          updatedPost.upvotedby.length - updatedPost.downvotedby.length;
        updatedPost = await Post.findByIdAndUpdate(
          postId,
          { score },
          { new: true }
        );

        // Send the updated comment back to the client for storing & display
        response.success = true;
        response.post = updatedPost;
        res.json(response);
      } else {
        response.message = 'The post was not found';
        res.json(response);
      }
    } else {
      response.message = 'The user was not found or is banned';
      res.json(response);
    }
  } catch (err) {
    response.message = `Could not upvote, check error ${err}`;
    res.json(response);
  }
};

postController.downvote = async (req, res) => {
  let response = {};
  try {
    let postId = req.params.id;
    let userId = req.body.userId;
    // Check if the user is not banned
    let user = await User.findById(userId);
    // Continue if the user is not banned
    if (user && !user.banned) {
      // Find the post to be upvoted
      let post = await Post.findById(postId);
      if (post) {
        let allUpvotes = post.upvotedby.map((obj) => obj.toString());
        let allDownvotes = post.downvotedby.map((obj) => obj.toString());
        let operator = allDownvotes.includes(userId) ? '$pull' : '$addToSet';

        // Add or remove the downvote from the post
        let updatedPost = await Post.findByIdAndUpdate(
          postId,
          {
            [operator]: { downvotedby: userId }
          },
          { new: true }
        );
        // If the post was already upvoted, then remove the downvote
        if (allUpvotes.includes(userId)) {
          updatedPost = await Post.findByIdAndUpdate(
            postId,
            {
              $pull: { upvotedby: userId }
            },
            { new: true }
          );
        }

        // Now update the score
        let score =
          updatedPost.upvotedby.length - updatedPost.downvotedby.length;
        updatedPost = await Post.findByIdAndUpdate(
          postId,
          { score },
          { new: true }
        );

        // Send the updated comment back to the client for storing & display
        response.success = true;
        response.post = updatedPost;
        res.json(response);
      } else {
        response.message = 'The post was not found';
        res.json(response);
      }
    } else {
      response.message = 'The user was not found or is banned';
      res.json(response);
    }
  } catch (err) {
    response.message = `Could not downvote, check error ${err}`;
    res.json(response);
  }
};

postController.deletePost = async (req, res) => {
  // TODO Check if the user owns the post or if the user is an admin
  let response = {};
  try {
    await Post.findByIdAndDelete({ _id: req.params.id });
    response.success = true;
    response.message = 'Successfully deleted the post!';
    response.deletedId = req.params.id;
    res.json(response);
  } catch (error) {
    response.message = 'Could not delete';
    res.json(response);
  }
};

postController.getAllPostsByUser = async (req, res) => {
  let response = {};
  try {
    let posts = await Post.find({ username: req.params.username }).limit(50);
    let currentUser = await User.findOne({ username: req.params.username });
    response.posts = posts;
    response.currentUser = helpers.stripTheUserData(currentUser);
    response.success = true;
    res.json(response);
  } catch (error) {
    response.message = `The server encountered an error while getting all the posts ${error}`;
    res.json(response);
  }
};

module.exports = postController;
