const config = {};

config.development = {
  name: 'development',
  httpPort: 8080,
  httpsPort: 8081,
  database: 'mongodb://tamal:reddit2@ds119930.mlab.com:19930/reddit-clone-20',
  secret: 'coolcake'
};

config.production = {
  name: 'production',
  httpPort: 8080,
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
