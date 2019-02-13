const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String
  },
  password: {
    type: String
  },
  created: {
    type: Date,
    default: Date.now()
  },
  name: {
    type: String
  }
});

module.exports = mongoose.model('User', userSchema);
