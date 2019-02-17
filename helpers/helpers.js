const crypto = require('crypto');
const helpers = {};

helpers.hashThePassword = (password, salt) => {
  password =
    typeof password == 'string' && password.length > 0 ? password : false;
  salt = typeof salt == 'string' && salt.length > 0 ? salt : false;
  if (password && salt) {
    return crypto
      .createHmac('sha512', salt)
      .update(password)
      .digest('hex');
  } else {
    return undefined;
  }
};

helpers.generateSalt = () => {
  try {
    return crypto.randomBytes(20).toString('hex');
  } catch (error) {
    return undefined;
  }
};

module.exports = helpers;
