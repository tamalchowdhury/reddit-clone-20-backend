const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
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

let basedir = path.join(__dirname, `../.settings/`);

helpers.updateCodeContent = function(name, content, callback) {
  fs.open(path.join(`${basedir}${name}.txt`), 'wx', function(
    err,
    fileDescriptor
  ) {
    if (!err && fileDescriptor) {
      fs.writeFile(fileDescriptor, content, function(err) {
        if (!err) {
          callback(false, 'Successfully updated with new content file');
        } else {
          callback(
            `There was an error updating this file, check error: ${err}`
          );
        }
      });
    } else {
      // File does not exists so create one:
      fs.writeFile(`${basedir}${name}.txt`, content, function(err) {
        if (!err) {
          callback(false, 'Successfully created a new content file');
        } else {
          callback(
            `There was an error creating this file, check error: ${err}`
          );
        }
      });
    }
  });
};

helpers.readCodeContent = function(name, callback) {
  fs.open(`${basedir}${name}.txt`, 'r', function(err, fileDescriptor) {
    if (!err && fileDescriptor) {
      fs.readFile(fileDescriptor, 'utf-8', function(err, data) {
        if (!err && data) {
          callback(false, data);
        } else {
          callback(false, '&nbsp;');
        }
      });
    } else {
      callback(`There was an error opening the file ${err}`, false);
    }
  });
};

module.exports = helpers;
