const path = require('path');
const express = require('express');
const app = express();
const config = require('./config');
const routes = require('./routes/api');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const expressValidator = require('express-validator');

const server = {};

mongoose.connect(config.database);
mongoose.Promise = global.Promise;
mongoose.connection.on('error', (err) => {
  console.log('Error in the database:', err);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(express.static(path.join(__dirname, 'client')));

app.use('/api', routes);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

app.listen(config.httpPort, () => {
  console.log(
    `We have a ${config.name} server running on PORT: ${config.httpPort}`
  );
});

module.exports = server;
