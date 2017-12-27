// import modules
const winston = require('winston');
const fs = require('fs');
const moment = require('moment');

const env = process.env.NODE_ENV || 'development';
const logDir = 'log';

// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      timestamp: moment().format(),
      colorize: true,
      level: 'info'
    }),
    new (winston.transports.File)({
      filename: `${logDir}/results.log`,
      timestamp: moment().format(),
      level: env === 'development' ? 'debug' : 'info'
    })
  ]
});

module.exports = logger;
