const mongoose = require('mongoose');

const CoinSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true
  },
  baseLinkUrl: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  baseImageUrl: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  symbol: {
    type: String,
    required: true
  },
  coinName: {
    type: String,
    required: true
  },
  fullName: {
    type: String,
    required: true
  },
  algorithm: {
    type: String,
    required: true
  },
  proofType: {
    type: String,
    required: true
  },
  fullyPremined: {
    type: Boolean,
    required: true,
    default: false
  },
  totalCoinSupply: {
    type: Number,
    required: true,
    default: -1 // unknown
  },
  preMinedValue: {
    type: Number,
    required: true,
    default: -1
  },
  totalCoinsFreeFloat: {
    type: Number,
    required: true,
    default: -1
  },
  sortOrder: {
    type: Number,
    required: true,
    default: 0
  },
  cryptoCompareKey: {
    type: String,
    required: true
  },
  cryptoCompareSponsored: {
    type: Boolean,
    required: true,
    default: false
  }
}, {
  timestamps: true
});

CoinSchema.statics.getAllCoinSymbols = function getAllCoinSymbols() {
  return this.find({})
    .select('cryptoCompareKey')
    .exec()
    .then(coins => Promise.resolve(coins.map(coin => coin.cryptoCompareKey)))
    .catch(err => Promise.reject(err));
};

module.exports = mongoose.model('Coin', CoinSchema);
