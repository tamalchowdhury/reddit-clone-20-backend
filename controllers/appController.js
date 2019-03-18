const appController = {};
const Widget = require('../models/Widget');
const helpers = require('../helpers/helpers');

appController.updateSettings = (req, res) => {
  let response = {};
  try {
    // Get the data
    // Put the data into the database
    let { topBanner } = req.body;

    helpers.updateCodeContent('top-banner', topBanner, function(err, message) {
      if (!err) {
        response.success = true;
        response.message = 'Successfully updated the settings';
        res.json(response);
      } else {
        response.message = err;
        res.json(response);
      }
    });
  } catch (error) {
    response.message = `There was an error taking this action, see error: ${error}`;
    res.json(response);
  }
};

appController.readFileContents = (req, res) => {
  let content = {};
  try {
    helpers.readCodeContent('top-banner', function(err, content) {
      if (!err && content) {
        res.json({ topBanner: content });
      } else {
        // Throw error or something
        res.end();
      }
    });
  } catch (error) {}
};

module.exports = appController;
