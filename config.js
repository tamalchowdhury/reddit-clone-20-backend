const config = {};

config.development = {
  name: 'development',
  httpPort: 5000,
  httpsPort: 5001,
  database: 'mongodb://localhost/reddit-clone-20',
  secret: 'coolcake'
};

config.production = {
  name: 'production',
  httpPort: 80,
  httpsPort: 443,
  database: 'mongodb://tamal:reddit2@ds119930.mlab.com:19930/reddit-clone-20',
  secret: 'whateverIlike'
};

let envToExport = {};

if (process.env.NODE_ENV == 'production') {
  envToExport = config.production;
} else {
  envToExport = config.development;
}

module.exports = envToExport;
