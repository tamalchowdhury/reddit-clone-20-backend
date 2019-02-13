const User = require('../models/User');
const jwt = require('jsonwebtoken');
const config = require('../config');
const userController = {};

userController.register = async (req, res) => {
  let response = {};
  try {
    let user = new User(req.body);
    await user.save();
    // Create a new token for the user
    response.token = jwt.sign(
      { username: user.username, _id: user._id },
      config.secret,
      {
        expiresIn: '1h'
      }
    );

    response.user = user;
    response.success = true;
    res.json(response);
  } catch (error) {
    res.json(response);
  }
};

// POST login controller
userController.login = async (req, res) => {
  let response = {};
  try {
    // Check if the user exists
    let user = await User.findOne({ username: req.body.username });
    if (user) {
      // TODO
      // Check if the password matches..
      // Delete the password/hash info then send it
      // Create a new token for the user
      response.token = jwt.sign(
        { username: user.username, _id: user._id },
        config.secret,
        {
          expiresIn: '1h'
        }
      );
      response.user = user;
      response.success = true;
      res.json(response);
    }
  } catch (error) {
    res.json(response);
  }
};

module.exports = userController;
