const config = require('../config/config');

module.exports = () => {
  let usernameAndOrPassword = '';

  if (config.mongo.username && !config.mongo.password) {
    usernameAndOrPassword = `${config.mongo.username}@`;
  } else if (config.mongo.username && config.mongo.password) {
    usernameAndOrPassword = `${config.mongo.username}:${config.mongo.password}@`;
  }

  return `mongodb://${usernameAndOrPassword}${config.mongo.host}:${config.mongo.port}/${config.mongo.db}`;
};
