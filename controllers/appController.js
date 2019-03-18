const appController = {};
const helpers = require('../helpers/helpers');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const config = require('../config');

appController.updateSettings = async (req, res) => {
  let response = {};
  // Verify if the user has admin access!
  try {
    let {
      topBanner,
      footerBanner,
      commentBanner,
      sidebarBanner,
      rulesCode,
      extraCode
    } = req.body;

    let errors = [];

    let recievedToken = req.headers.authorization.split(' ')[1];
    let decodedToken = jwt.verify(recievedToken, config.secret);
    let validUser = await User.findById(decodedToken._id);

    if (validUser && validUser.isAdmin) {
      helpers.updateCodeContent('top-banner', topBanner, function(err) {
        if (err) {
          errors.push[err];
        }
      });

      helpers.updateCodeContent('footer-banner', footerBanner, function(err) {
        if (err) {
          errors.push[err];
        }
      });

      helpers.updateCodeContent('comment-banner', commentBanner, function(err) {
        if (err) {
          errors.push[err];
        }
      });

      helpers.updateCodeContent('sidebar-banner', sidebarBanner, function(err) {
        if (err) {
          errors.push[err];
        }
      });

      helpers.updateCodeContent('rules-code', rulesCode, function(err) {
        if (err) {
          errors.push[err];
        }
      });

      helpers.updateCodeContent('extra-code', extraCode, function(err) {
        if (err) {
          errors.push[err];
        }
      });
      if (!errors.length) {
        response.success = true;
        response.message = 'Successfully updated the settings';
        res.json(response);
      } else {
        response.message = 'Something went wrong';
        res.json(response);
      }
    } else {
      response.message = 'You are not authorized to perform this action!';
      res.json(response);
    }
  } catch (error) {
    response.message = `There was an error taking this action, see error: ${error}`;
    res.json(response);
  }
};

appController.readFileContents = (req, res) => {
  let response = {};
  let codes = {};
  let errors = [];
  try {
    helpers.readCodeContent('top-banner', function(err, content) {
      if (!err && content) {
        codes.topBanner = content;
        helpers.readCodeContent('footer-banner', function(err, content) {
          if (!err && content) {
            codes.footerBanner = content;
            helpers.readCodeContent('sidebar-banner', function(err, content) {
              if (!err && content) {
                codes.sidebarBanner = content;
                helpers.readCodeContent('comment-banner', function(
                  err,
                  content
                ) {
                  if (!err && content) {
                    codes.commentBanner = content;
                    helpers.readCodeContent('rules-code', function(
                      err,
                      content
                    ) {
                      if (!err && content) {
                        codes.rulesCode = content;
                        helpers.readCodeContent('extra-code', function(
                          err,
                          content
                        ) {
                          if (!err && content) {
                            codes.extraCode = content;
                            response.success = true;
                            response.codes = codes;
                            res.json(response);
                          } else {
                            errors.push[err];
                          }
                        });
                      } else {
                        errors.push[err];
                      }
                    });
                  } else {
                    errors.push[err];
                  }
                });
              } else {
                errors.push[err];
              }
            });
          } else {
            errors.push[err];
          }
        });
      } else {
        errors.push[err];
      }
    });

    // if (!errors.length) {
    //   response.success = true;
    //   response.codes = codes;
    //   res.json(response);
    // } else {
    //   response.message = errors;
    //   res.json(response);
    // }
  } catch (error) {
    response.message = `Something went wrong, please check error: ${error}`;
    res.json(response);
  }
};

module.exports = appController;
