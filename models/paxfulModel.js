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
    amount: {
      type: mongoose.Decimal128,
    },
    rating: {
      type: mongoose.Decimal128,
    },
  },
});

paxfulSchema.pre('save', function (next) {
  console.log('saving...');
  console.log(this);
  this.remainingBalance.amount = parseFloat(this.btcAmount);

  if (parseFloat(this.remainingBalance.amount) !== 0) {
    this.remainingBalance.rating =
      Math.round(
        ((parseFloat(this.moneySpent.amount) * 100000000) /
          (parseFloat(this.btcAmount) * 100000000)) *
          100000000
      ) / 100000000;
  } else {
    this.remainingBalance.rating = null;
  }

  next();
});

const paxfulModel = mongoose.model('PaxfulDeposit', paxfulSchema);

module.exports = paxfulModel;
