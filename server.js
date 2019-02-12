const express = require('express');
const app = express();
const config = require('./config');
const routes = require('./routes/api');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const server = {};

mongoose.connect(config.database);
mongoose.Promise = global.Promise;
mongoose.connection.on('error', () => {
  console.log('Error in the database:', err);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

server.init = function() {
  app.use('/api', routes);
  app.listen(config.httpPort, () => {
    console.log(
      `We have a ${config.name} server running on PORT: ${config.httpPort}`
    );
  });
};

module.exports = server;
