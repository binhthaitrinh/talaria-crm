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
  btcUsdRate: {
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
    amount: {
      type: mongoose.Decimal128,
      required: [true, 'A Paxful deposit must list how much money spent'],
    },
    currency: {
      type: String,
      enum: ['vnd', 'usd'],
      default: 'vnd',
    },
  },
  remainingBalance: {
    type: mongoose.Decimal128,
  },
});

paxfulSchema.pre('save', function (next) {
  console.log('saving...');
  console.log(this);
  this.remainingBalance = parseFloat(this.btcAmount);

  next();
});

const paxfulModel = mongoose.model('PaxfulDeposit', paxfulSchema);

module.exports = paxfulModel;
