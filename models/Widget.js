const mongoose = require('mongoose');
const widgetSchema = new mongoose.Schema({
  topBanner: String,
  commentBanner: String,
  sidebarBanner: String,
  footerBanner: String,
  rulesArea: String,
  htmlArea: String
});

module.exports = mongoose.model('Widget', widgetSchema);
