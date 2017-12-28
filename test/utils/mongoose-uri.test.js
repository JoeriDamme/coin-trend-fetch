const { expect } = require('chai');
const proxyquire = require('proxyquire');

const methodUnderTestA = proxyquire('../../utils/mongoose-uri', {
  '../config/config': {
    mongo: {
      username: '',
      password: '',
      host: 'localhost',
      port: 27017,
      db: 'coin-trend-test'
    }
  }
});

const methodUnderTestB = proxyquire('../../utils/mongoose-uri', {
  '../config/config': {
    mongo: {
      username: 'joeri',
      password: '',
      host: 'localhost',
      port: 27017,
      db: 'coin-trend-test'
    }
  }
});

const methodUnderTestC = proxyquire('../../utils/mongoose-uri', {
  '../config/config': {
    mongo: {
      username: 'joeri',
      password: 'secret',
      host: 'localhost',
      port: 27017,
      db: 'coin-trend-test'
    }
  }
});

describe('utils/mongoose-uri.js', () => {
  it('should create valid string with no username and no password', () => {
    const result = methodUnderTestA();
    expect(result).to.equal('mongodb://localhost:27017/coin-trend-test');
  });

  it('should create valid string with only username and no password', () => {
    const result = methodUnderTestB();
    expect(result).to.equal('mongodb://joeri@localhost:27017/coin-trend-test');
  });

  it('should create valid string with username and password', () => {
    const result = methodUnderTestC();
    expect(result).to.equal('mongodb://joeri:secret@localhost:27017/coin-trend-test');
  });
});
