const User = require('../models/User');
const jwt = require('jsonwebtoken');
const config = require('../config');
const helpers = require('../helpers/helpers');
const userController = {};

userController.validateRegInfo = (req, res, next) => {
  let response = {};
  req.sanitizeBody('username');
  req.checkBody('username', 'Username should not be empty!').notEmpty();
  req.sanitizeBody('email');
  req.checkBody('email', 'Email should not be empty').notEmpty();
  req.checkBody('email', 'You must enter a valid email to register').isEmail();
  req.checkBody('password', 'Password should not be empty').notEmpty();
  req
    .checkBody('passwordConfirm', 'Password confirmation should not be empty')
    .notEmpty();
  req
    .checkBody('passwordConfirm', 'Both passwords does not match!')
    .equals(req.body.password);

  let errors = req.validationErrors();
  if (errors) {
    response.message = 'Please fix validation errors';
    console.log(errors);
    res.json(response);
  } else {
    next();
  }
};

userController.validateLoginInfo = (req, res, next) => {};

userController.checkIfUserExists = (req, res, next) => {};

let issueNewToken = (username, _id) => {
  username = typeof username == 'string' && username.length > 0;
  _id = typeof _id == 'string';
  if (username && _id) {
    return jwt.sign({ username, _id }, config.secret, { expiresIn: '1h' });
  } else {
    return undefined;
  }
};

userController.register = async (req, res) => {
  let response = {};
  try {
    let salt = helpers.generateSalt();
    let hash = helpers.hashThePassword(req.body.password, salt);

    delete req.body.password;
    delete req.body.passwordConfirm;

    let user = new User(req.body);
    user.salt = salt;
    user.hash = hash;

    await user.save();
    // Create a new token for the user
    response.token = jwt.sign(
      { username: user.username, _id: user._id },
      config.secret,
      {
        expiresIn: '1h'
      }
    );

    delete user.salt;
    delete user.hash;

    response.user = user;
    response.success = true;
    res.json(response);
  } catch (error) {
    response.message = 'Something went wrong in the server';
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
