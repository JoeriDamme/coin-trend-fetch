const cryptocompare = require('cryptocompare');
const logger = require('../config/winston');

module.exports = () => {
  cryptocompare.coinList()
    .then((result) => {
      logger.info(result);
    }, (err) => {
      logger.error(err);
    });
};
