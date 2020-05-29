const mongoose = require('mongoose');

const paxfulSchema = mongoose.Schema({
  date: {
    type: Date,
    default: Date.now(),
  },
  btcAmount: {
    type: mongoose.Decimal128,
    required: [true, 'A Paxful deposit must have an amount'],
  },
  usdVndRate: {
    type: mongoose.Decimal128,
    default: 23700,
  },
  btcUsdDate: {
    type: mongoose.Decimal128,
  },
  withdrawFee: {
    type: mongoose.Decimal128,
    currency: {
      type: String,
      enum: ['vnd', 'usd'],
    },
  },
  buyer: {
    type: String,
  },
  pocketMoney: Boolean,
  notes: String,
  moneySpent: {
    type: mongoose.Decimal128,
    required: [true, 'A Paxful deposit must list how much money spent'],
    currency: {
      type: String,
      enum: ['vnd', 'usd'],
    },
  },
});

const paxfulModel = mongoose.model('PaxfulDeposit', paxfulSchema);

module.exports = paxfulModel;
