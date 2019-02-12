const config = {};

config.development = {
  name: 'Development',
  httpPort: 5000,
  httpsPort: 5001,
  database: 'mongodb://localhost/reddit-clone-20'
};

config.production = {
  name: 'Production',
  httpPort: 80,
  httpsPort: 443,
  database: ''
};

let envToExport = {};

if (process.env.NODE_ENV == 'Production') {
  envToExport = config.production;
} else {
  envToExport = config.development;
}

module.exports = envToExport;
