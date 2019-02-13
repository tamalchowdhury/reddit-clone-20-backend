const User = require('../models/User');
const userController = {};

userController.register = async (req, res) => {
  let response = {};
  try {
    let user = new User(req.body);
    await user.save();
    response.user = user;
    response.success = true;
    res.json(response);
  } catch (error) {
    res.json(response);
  }
};

module.exports = userController;
