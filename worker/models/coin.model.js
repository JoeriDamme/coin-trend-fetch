const mongoose = require('mongoose');

const CoinSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true
  },
  imageUrl: {
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
    type: Number,
    required: true,
    default: 0
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
  }
});

module.exports = mongoose.model('Coin', CoinSchema);
