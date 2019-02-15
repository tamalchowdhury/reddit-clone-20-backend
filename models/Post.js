const mongoose = require('mongoose');
const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  text: {
    type: String
  },
  link: {
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
  username: {
    type: String
  },
  score: {
    type: Number,
    default: 1
  },
  upvotedby: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    }
  ],
  downvotedby: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    }
  ]
});

module.exports = mongoose.model('Post', postSchema);
