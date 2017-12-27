const cryptocompare = require('cryptocompare');
const logger = require('../config/winston');
const Coin = require('./models/coin.model');
const Promise = require('bluebird');

module.exports = () => {
  // count number coins currently in database:
  let currentNumberCoins;

  Coin.count({})
    .then((countResult) => {
      currentNumberCoins = countResult;
      logger.info(`${currentNumberCoins} coins currently in database`);
      return cryptocompare.coinList();
    })
    .then((result) => {
      const baseImageUrl = result.BaseImageUrl;
      const baseLinkUrl = result.BaseLinkUrl;
      const coins = [];

      Object.entries(result.Data).forEach(([key, value]) => {
        const coin = {
          cryptoCompareKey: key,
          cryptoCompareSponsored: value.Sponsored,
          url: value.Url,
          baseLinkUrl,
          imageUrl: value.ImageUrl,
          baseImageUrl,
          name: value.Name,
          symbol: value.Symbol,
          coinName: value.CoinName,
          fullName: value.FullName,
          algorithm: value.Algorithm,
          proofType: value.ProofType,
          fullyPremined: value.FullyPremined === '1',
          totalCoinSupply: Number.parseInt(value.TotalCoinSupply, 10) || -1,
          preMinedValue: Number.parseInt(value.PreMinedValue, 10) || -1,
          totalCoinsFreeFloat: Number.parseInt(value.TotalCoinsFreeFloat, 10) || -1,
          sortOrder: value.SortOrder
        };

        coins.push(coin);
      });

      return Promise.each(coins, coin => Coin.findOneAndUpdate({
        cryptoCompareKey: coin.cryptoCompareKey
      }, coin, {
        upsert: true
      }));
    })
    .then(() => Coin.count({}))
    .then((newCountResult) => {
      logger.info(`${newCountResult} coins currently in database after update. ${newCountResult - currentNumberCoins} new coins.`);
    })
    .catch((err) => {
      logger.error(err);
    });
};
