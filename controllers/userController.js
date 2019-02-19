const User = require('../models/User');
const jwt = require('jsonwebtoken');
const config = require('../config');
const helpers = require('../helpers/helpers');
const userController = {};

userController.validateRegInfo = (req, res, next) => {
  let response = {};
  let { username, password, passwordConfirm, email } = req.body;
  if (username && password && passwordConfirm && email) {
    req.sanitizeBody('username');
    req.checkBody('username', 'Username should not be empty!').notEmpty();
    req.sanitizeBody('email');
    req.checkBody('email', 'Email should not be empty').notEmpty();
    req
      .checkBody('email', 'You must enter a valid email to register')
      .isEmail();
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
      res.json(response);
    } else {
      next();
    }
  } else {
    response.message = 'Required fields are missing';
    res.json(response);
  }
};

userController.validateLoginInfo = (req, res, next) => {
  let response = {};
  let { username, password } = req.body;
  username =
    typeof username == 'string' && username.length > 0 ? username : false;
  password =
    typeof password == 'string' && password.length > 0 ? password : false;

  if (username && password) {
    next();
  } else {
    response.message = 'Required fields are missing';
    res.json(response);
  }
};

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
  let { username, password, email } = req.body;
  try {
    // Check if the username is taken
    let existingUser = await User.findOne({ username });

    if (existingUser) {
      response.message = 'The username is already taken';
      res.json(response);
      return;
    } else {
      let salt = helpers.generateSalt();
      let hash = helpers.hashThePassword(password, salt);

      req.body.password = undefined;
      req.body.passwordConfirm = undefined;

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

      response.user = helpers.stripTheUserData(user);
      response.success = true;
      res.json(response);
    }
  } catch (error) {
    response.message = 'Something went wrong in the server';
    res.json(response);
  }
};

// POST login controller
userController.login = async (req, res) => {
  let response = {};
  try {
    let { username, password } = req.body;
    // Check if the user exists
    let user = await User.findOne({ username });
    if (user && user.hash && user.salt) {
      // TODO
      // Check if the password matches..
      let hashedPassword = helpers.hashThePassword(password, user.salt);

      if (hashedPassword == user.hash) {
        // Delete the password/hash info then send it
        // Create a new token for the user
        response.token = jwt.sign(
          { username: user.username, _id: user._id },
          config.secret,
          {
            expiresIn: '1h'
          }
        );

        response.user = helpers.stripTheUserData(user);
        response.success = true;
        res.json(response);
      } else {
        response.message = 'Username or password does not match!';
        res.json(response);
      }
    } else {
      response.message = 'There is no user with that username';
      res.json(response);
    }
  } catch (error) {
    res.message = `The server got an error while trying to check the username`;
    res.json(response);
  }
};

module.exports = userController;
