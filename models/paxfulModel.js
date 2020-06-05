const mongoose = require('mongoose');
const AppError = require('../utils/appError');

const paxfulSchema = mongoose.Schema({
  createdAt: {
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
    default: 0,
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
    amount: {
      type: mongoose.Decimal128,
    },
    rating: {
      type: mongoose.Decimal128,
    },
  },
});

paxfulSchema.pre('save', function (next) {
  if (parseFloat(this.btcAmount) <= 0) {
    return next(new AppError('Deposit BTC amount must be positive', 400));
  }

  if (this.moneySpent.currency === 'usd') {
    this.moneySpent.amount =
      Math.round(this.moneySpent.amount * 100 * this.usdVndRate * 100) / 10000;
    this.moneySpent.currency = 'vnd';
  }
  this.remainingBalance.amount = parseFloat(this.btcAmount);

  this.remainingBalance.rating =
    Math.round(
      ((parseFloat(this.moneySpent.amount) * 100000000) /
        (parseFloat(this.btcAmount) * 100000000 +
          parseFloat(this.withdrawFee) * 100000000)) *
        100000000
    ) / 100000000;

  next();
});

const paxfulModel = mongoose.model('PaxfulDeposit', paxfulSchema);

module.exports = paxfulModel;
