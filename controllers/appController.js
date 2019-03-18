const appController = {};
const Widget = require('../models/Widget');
const helpers = require('../helpers/helpers');

appController.updateSettings = (req, res) => {
  let response = {};
  try {
    // Get the data
    // Put the data into the database
    let {
      topBanner,
      footerBanner,
      commentBanner,
      sidebarBanner,
      rulesCode,
      extraCode
    } = req.body;

    let errors = [];

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
      throw new Error(error);
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
      } else {
        errors.push[err];
      }
    });
    helpers.readCodeContent('footer-banner', function(err, content) {
      if (!err && content) {
        codes.footerBanner = content;
      } else {
        errors.push[err];
      }
    });
    helpers.readCodeContent('sidebar-banner', function(err, content) {
      if (!err && content) {
        codes.sidebarBanner = content;
      } else {
        errors.push[err];
      }
    });
    helpers.readCodeContent('comment-banner', function(err, content) {
      if (!err && content) {
        codes.commentBanner = content;
      } else {
        errors.push[err];
      }
    });
    helpers.readCodeContent('rules-code', function(err, content) {
      if (!err && content) {
        codes.rulesCode = content;
      } else {
        errors.push[err];
      }
    });
    helpers.readCodeContent('extra-code', function(err, content) {
      if (!err && content) {
        codes.extraCode = content;
      } else {
        errors.push[err];
      }
    });

    if (!errors.length) {
      response.success = true;
      response.codes = codes;
      res.json(response);
    } else {
      response.message = errors;
      res.json(response);
    }
  } catch (error) {
    response.message = `Something went wrong, please check error: ${error}`;
    res.json(response);
  }
};

module.exports = appController;
