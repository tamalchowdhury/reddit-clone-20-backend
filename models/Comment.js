const mongoose = require('mongoose');
const commentSchema = new mongoose.Schema({
  comment: {
    type: String
  },
  created: {
    type: Date,
    default: Date.now()
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  post: {
    type: mongoose.Schema.ObjectId,
    ref: 'Post'
  },
  username: {
    type: String
  }
});

module.exports = mongoose.model('Comment', commentSchema);
