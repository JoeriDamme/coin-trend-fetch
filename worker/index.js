const cryptocompare = require('cryptocompare');
const logger = require('../config/winston');
const Coin = require('./models/coin.model');
const CoinData = require('./models/coin-data.model');
const Promise = require('bluebird');
const priceFullParams = require('../utils/price-full-params-array');
const _ = require('lodash');

module.exports = () => {
  // count number coins currently in database:
  let currentNumberCoins;
  let storedCoins;

  return Coin.count({})
    .then((countResult) => {
      currentNumberCoins = countResult;
      logger.info(`${currentNumberCoins} coins currently in database`);
      logger.info('GET requests on https://min-api.cryptocompare.com/data/all/coinlist ...');
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
    .then(() => Coin.find({})
      .select('symbol')
      .exec())
    .then((countCoinsAgain) => {
      storedCoins = countCoinsAgain; // needed for getting the coin Id
      logger.info(`${countCoinsAgain.length} coins currently in database after update. ${countCoinsAgain.length - currentNumberCoins} new coins.`);
      return Coin.getAllCoinSymbols();
    })
    .then((coinsArray) => {
      let promiseResolveCount = 0;
      const coinsParam = priceFullParams(coinsArray);
      logger.info(`${coinsParam.length} GET requests on https://min-api.cryptocompare.com/data/pricemultifull ...`);

      const cryptocomparePriceFullPromises = [];
      coinsParam.forEach((value) => {
        const req = cryptocompare.priceFull(value, ['USD', 'EUR'])
          .then((result) => {
            promiseResolveCount += 1;
            logger.info(`${promiseResolveCount} GET request resolved ...`);
            return result;
          });
        cryptocomparePriceFullPromises.push(req);
      });

      return Promise.all(cryptocomparePriceFullPromises);
    })
    .then((priceData) => {
      // concat all the results of the promises
      const allPriceData = priceData.reduce((acc, currentObject) => {
        Object.keys(currentObject).forEach((key) => {
          acc[key] = currentObject[key];
        });
        return acc;
      });

      logger.info(`Data received for ${Object.keys(allPriceData).length} coins`);

      const coinAllData = [];

      Object.values(allPriceData).forEach((value) => {
        Object.values(value).forEach((info) => {
          const coinObj = _.find(storedCoins, { symbol: info.FROMSYMBOL });

          if (!coinObj) {
            logger.error(`Can not find Id for coin ${info.FROMSYMBOL}`);
            return;
          }

          const coinData = new CoinData({
            coin: coinObj,
            coinType: info.TYPE,
            market: info.MARKET,
            fromSymbol: info.FROMSYMBOL,
            toSymbol: info.TOSYMBOL,
            flags: info.FLAGS,
            price: info.PRICE,
            lastUpdate: info.LASTUPDATE,
            lastVolume: info.LASTVOLUME,
            lastVolumeTo: info.LASTVOLUMETO,
            lastTradeId: info.LASTTRADEID,
            volumeDay: info.VOLUMEDAY || -1, // new coin doesn't have this value
            volumeDayTo: info.VOLUMEDAYTO || -1, // new coin doesn't have this value
            volume24Hour: info.VOLUME24HOUR,
            volume24HourTo: info.VOLUME24HOURTO,
            openDay: info.OPENDAY || -1, // new coin doesn't have this value
            highDay: info.HIGHDAY || -1, // new coin doesn't have this value
            lowDay: info.LOWDAY || -1, // new coin doesn't have this value
            open24Hour: info.OPEN24HOUR,
            high24Hour: info.HIGH24HOUR,
            low24Hour: info.LOW24HOUR,
            lastMarket: info.LASTMARKET,
            change24Hour: info.CHANGE24HOUR || -1,
            changePct24Hour: info.CHANGEPCT24HOUR || -1,
            changeDay: info.CHANGEDAY,
            changePctDay: info.CHANGEPCTDAY,
            supply: info.SUPPLY,
            marketCap: info.MKTCAP,
            totalVolume24Hour: info.TOTALVOLUME24H,
            totalVolume24HourTo: info.TOTALVOLUME24HTO
          });
          coinAllData.push(coinData.save());
        });
      });

      return Promise.all(coinAllData);
    })
    .then((storedData) => {
      logger.info(`${storedData.length} data points stored!`);
      return Promise.resolve();
    })
    .catch((err) => {
      logger.error(err);
    });
};
