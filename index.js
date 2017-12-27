// import modules
const mongoose = require('mongoose');
const Promise = require('bluebird');
const config = require('./config/config');
const debug = require('debug');
const util = require('util');
const logger = require('./config/winston');
const mongooseUri = require('./utils/mongoose-uri');
const worker = require('./worker/index');
global.fetch = require('node-fetch');

logger.info('configuration:', config);

// plugin bluebird promise in mongoose
mongoose.Promise = Promise;

// connect to mongo db
// const mongoUri = `mongodb://${config.mongo.username}:${config.mongo.password}@${config.mongo.host}:${config.mongo.port}`;
mongoose.connect(mongooseUri(), {
  useMongoClient: true,
  keepAlive: 1,
  connectTimeoutMS: 1000
})
  .then(() => {
    logger.info(`connected to database: ${mongooseUri()}`);
  })
  .catch((err) => {
    logger.error(`unable to connect to database: ${mongooseUri()}: ${err}`);
    // fix because logger.err is async
    setTimeout(() => {
      process.exit();
    }, 5000);
  });

// print mongoose logs in dev env
if (config.MONGOOSE_DEBUG) {
  mongoose.set('debug', (collectionName, method, query, doc) => {
    debug(`${collectionName}.${method}`, util.inspect(query, false, 20), doc);
  });
}

worker();
