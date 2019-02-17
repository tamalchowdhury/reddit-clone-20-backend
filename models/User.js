const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  email: {
    type: String
  },
  hash: {
    type: String
  },
  salt: {
    type: String
  },
  banned: {
    type: Boolean,
    default: false
  },
  shadowed: {
    type: Boolean,
    default: false
  },
  created: {
    type: Date,
    default: Date.now()
  },
  name: {
    type: String
  },
  upvotes: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Post'
    }
  ],
  downvotes: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Post'
    }
  ]
});

module.exports = mongoose.model('User', userSchema);
