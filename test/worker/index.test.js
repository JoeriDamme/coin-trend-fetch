
const chaiAsPromised = require('chai-as-promised');
const { expect } = require('chai').use(chaiAsPromised);
const sinon = require('sinon');
const Coin = require('../../worker/models/coin.model');
const Promise = require('bluebird');
const proxyquire = require('proxyquire');
const coinListData = require('./testdata/cryptocompare-coinlist');
const fullListData = require('./testdata/cryptocompare-fulllist');

const methodUnderTest = proxyquire('../../worker', {
  cryptocompare: {
    coinList() {
      return Promise.resolve(coinListData);
    }
  }
});

describe('worker/index.js', () => {
  let stubCointCount;
  let stubCoinFindOneAndUpdate;

  beforeEach(() => {
    stubCointCount = sinon.stub(Coin, 'count').returns(Promise.resolve(3));
    stubCoinFindOneAndUpdate = sinon.stub(Coin, 'findOneAndUpdate').returns(Promise.resolve());
  });

  afterEach(() => {
    stubCointCount.restore();
    stubCoinFindOneAndUpdate.restore();
  });

  it('should retrieve and store crypto currency', () => {
    return expect(methodUnderTest()).to.eventually.equal(true);
  });

  it.only('shoud merge response data from request on https://min-api.cryptocompare.com/data/pricemultifull', () => {
    expect(fullListData).to.have.lengthOf(2);
    expect(fullListData).to.be.an.instanceof(Array);
    expect(fullListData).to.be.an.instanceof(Array);
    expect(Object.keys(fullListData[0]).length).to.equal(70);
    expect(Object.keys(fullListData[1]).length).to.equal(67);

    const flattenArray = fullListData.reduce((acc, currentObject) => {
      Object.keys(currentObject).forEach((key) => {
        acc[key] = currentObject[key];
      });
      return acc;
    });

    expect(Object.keys(flattenArray).length).to.equal(137);
  });
});
