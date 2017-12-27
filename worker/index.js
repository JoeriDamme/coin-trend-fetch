const cryptocompare = require('cryptocompare');
const logger = require('../config/winston');

module.exports = () => {
  cryptocompare.coinList()
    .then((result) => {
      const baseImageUrl = result.BaseImageUrl;
      const baseLinkUrl = result.BaseLinkUrl;

      Object.entries(result.Data).forEach(([key, value]) => {
        console.log(key, value);
      });
    }, (err) => {
      logger.error(err);
    });
};
