const crypto = require('crypto');
const helpers = {};
const spamList = require('naughty-string-validator').getNaughtyStringList();

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

helpers.stripTheUserData = (userObject) => {
  if (typeof userObject == 'object') {
    userObject.hash = undefined;
    userObject.salt = undefined;
    return userObject;
  } else {
    return {};
  }
};

function spamWordFilter(inputText) {
  let pass = false;
  inputText.split(' ').forEach((word) => {
    if (word.length > 30) {
      // Check if it's an url
      if (
        word.includes('www.') ||
        word.includes('.com') ||
        word.includes('http') ||
        word.includes('@')
      ) {
        // Pass the word
        pass = true;
      } else {
        pass = false;
      }
    } else {
      pass = true;
    }
  });

  if (pass) {
    return inputText;
  } else {
    return '';
  }
}

helpers.spamFilter = (inputText) => {
  inputText = spamWordFilter(inputText);

  if (!inputText) return '';

  if (spamList.includes(inputText) || inputText.includes('<script>')) {
    return '';
  } else {
    return inputText;
  }
};

module.exports = helpers;
