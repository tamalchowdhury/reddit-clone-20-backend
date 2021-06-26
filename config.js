require("dotenv").config();
const config = {};

config.development = {
  name: "development",
  httpPort: 8080,
  httpsPort: 8081,
  database: process.env.DATABASE,
  secret: process.env.SECRET,
};

config.production = {
  name: "production",
  httpPort: 8080,
  httpsPort: 443,
  database: process.env.DATABASE,
  secret: process.env.SECRET,
};

// Change before deploying
const envToExport = config.production;

module.exports = envToExport;
