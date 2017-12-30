const mongoose = require('mongoose');

const CoinDataSchema = new mongoose.Schema({
  coin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Coin',
    required: true
  },
  coinType: {
    type: Number,
    required: true
  },
  market: {
    type: String,
    required: true
  },
  fromSymbol: {
    type: String,
    required: true
  },
  toSymbol: {
    type: String,
    required: true
  },
  flags: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  lastUpdate: {
    type: Number,
    required: true
  },
  lastVolume: {
    type: Number,
    required: true
  },
  lastVolumeTo: {
    type: Number,
    required: true
  },
  lastTradeId: {
    type: String,
    required: true,
  },
  volumeDay: {
    type: Number,
    required: true
  },
  volumeDayTo: {
    type: Number,
    required: true
  },
  volume24Hour: {
    type: Number,
    required: true,
  },
  volume24HourTo: {
    type: Number,
    required: true,
  },
  openDay: {
    type: Number,
    required: true
  },
  highDay: {
    type: Number,
    required: true
  },
  lowDay: {
    type: Number,
    required: true
  },
  open24Hour: {
    type: Number,
    required: true
  },
  high24Hour: {
    type: Number,
    required: true
  },
  low24Hour: {
    type: Number,
    required: true
  },
  lastMarket: {
    type: String,
    required: true
  },
  change24Hour: {
    type: Number,
    required: true
  },
  changePct24Hour: {
    type: Number,
    required: true
  },
  changeDay: {
    type: Number,
    required: true
  },
  changePctDay: {
    type: Number,
    required: true
  },
  supply: {
    type: Number,
    required: true
  },
  marketCap: {
    type: Number,
    required: true
  },
  totalVolume24Hour: {
    type: Number,
    required: true
  },
  totalVolume24HourTo: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('CoinData', CoinDataSchema);
