const { expect } = require('chai');
const sinon = require('sinon');
const Coin = require('../../worker/models/coin.model');
const CoinData = require('../../worker/models/coin-data.model');
const Promise = require('bluebird');
const proxyquire = require('proxyquire');
const coinListData = require('./testdata/cryptocompare-coinlist');
const fullListData = require('./testdata/cryptocompare-fulllist');

const methodUnderTest = proxyquire('../../worker', {
  cryptocompare: {
    coinList() {
      return Promise.resolve(coinListData);
    },
    priceFull() {
      return Promise.resolve(fullListData);
    }
  },
  lodash: {
    find() {
      return { _id: '123', symbol: 'DEM' };
    }
  }
});

describe('worker/index.js', () => {
  it('should retrieve and store crypto currency', () => {
    const stubCointCount = sinon.stub(Coin, 'count').returns(Promise.resolve(3));
    const stubCoinFindOneAndUpdate = sinon.stub(Coin, 'findOneAndUpdate').returns(Promise.resolve());
    const stubCoinFind = sinon.stub(Coin, 'find').returns({
      select() {
        return this;
      },
      exec() {
        return Promise.resolve([
          { _id: '123', symbol: 'DEM' },
          { _id: '124', symbol: 'DMD' },
          { _id: '125', symbol: 'XVG' }
        ]);
      }
    });
    const stubCoinGetAllCoinSymbols = sinon.stub(Coin, 'getAllCoinSymbols').returns(Promise.resolve(['DEM', 'DMD', 'XVG']));
    const stubCoinDataSave = sinon.stub(CoinData.prototype, 'save').returns(Promise.resolve());

    return methodUnderTest()
      .then(() => {
        stubCointCount.restore();
        stubCoinFindOneAndUpdate.restore();
        stubCoinFind.restore();
        stubCoinGetAllCoinSymbols.restore();
        stubCoinDataSave.restore();
      });
  });

  it('shoud merge response data from request on https://min-api.cryptocompare.com/data/pricemultifull', () => {
    expect(fullListData).to.have.lengthOf(3);
    expect(fullListData).to.be.an.instanceof(Array);
    expect(Object.keys(fullListData[0]).length).to.equal(70);
    expect(Object.keys(fullListData[1]).length).to.equal(67);
    expect(Object.keys(fullListData[2]).length).to.equal(2);

    const flattenArray = fullListData.reduce((acc, currentObject) => {
      Object.keys(currentObject).forEach((key) => {
        acc[key] = currentObject[key];
      });
      return acc;
    });

    expect(Object.keys(flattenArray).length).to.equal(139);
  });
});
