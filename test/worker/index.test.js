
const chaiAsPromised = require('chai-as-promised');
const { expect } = require('chai').use(chaiAsPromised);
const sinon = require('sinon');
const Coin = require('../../worker/models/coin.model');
const Promise = require('bluebird');
const proxyquire = require('proxyquire');
const coinListData = require('./testdata/cryptocompare-coinlist');

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
});
