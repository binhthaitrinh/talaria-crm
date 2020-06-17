const mongoose = require('mongoose');
const AppError = require('../utils/appError');
const btcTransactionModel = require('./btcTransactionModel');

const paxfulSchema = mongoose.Schema(
  {
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
        // required: [true, 'A Paxful deposit must list how much money spent'],
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
    transactionType: {
      type: String,
      enum: ['inflow', 'outflow'],
      required: [true, 'A paxful transaction must have a type'],
    },
    totalBalance: {
      type: mongoose.Decimal128,
    },
  },
  {
    // to include virtual properties into results
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// paxfulSchema.virtual('totalBalance').get(function () {
//   // try {
//   //   const result = await this.constructor.aggregate([
//   //     {
//   //       $match: { createdAt: { $lte: this.createdAt } },
//   //     },
//   //     {
//   //       $group: {
//   //         _id: null,
//   //         total: { $sum: '$btcAmount' },
//   //       },
//   //     },
//   //   ]);
//   //   console.log(parseFloat(result[0].total));
//   //   return 0;
//   // } catch (err) {
//   //   console.log(err);
//   // }
//   return 9999;
// });

// paxfulSchema.statics.calcTotalBalance = async function (date) {
//   const paxful = await this.aggregate([
//     {
//       $match: {
//         createdAt: { $lte: date },
//       },
//     },
//     {
//       $group: {
//         _id: null,
//         totalBalance: { $sum: '$btcAmount' },
//       },
//     },
//   ]);

//   console.log(parseFloat(paxful[0].totalBalance));
// };

// paxfulSchema.pre(/^find/, async function (next) {
//   this.constructor.calcTotalBalance();
// });

// findByIdAndUpdate
// findByIdAndDelete
// paxfulSchema.pre(/^find/, async function (next) {
//   // in order to send r variable to post below
//   console.log(this);

//   next();
// });

// paxfulSchema.post(/^findOneAnd/, async function () {
//   // retrieve review document from "this"
//   // await this.find(); does NOT work here, query has already executed, thus we have to do this
//   await this.r.constructor.calcTotalBalance();
// });

paxfulSchema.pre(/find/, function (next) {
  this.sort({ createdAt: -1 });

  next();
});

paxfulSchema.pre('save', async function (next) {
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

  const previous = await this.constructor.find().limit(1);

  if (previous.length === 0) {
    this.totalBalance = this.btcAmount;
    return next();
  }

  if (this.transactionType === 'inflow') {
    this.totalBalance =
      Math.round(
        parseFloat(previous[0].totalBalance) * 100000000 +
          parseFloat(this.btcAmount) * 100000000
      ) / 100000000;
  } else if (this.transactionType === 'outflow') {
    this.totalBalance =
      Math.round(
        parseFloat(previous[0].totalBalance) * 100000000 -
          parseFloat(this.btcAmount) * 100000000
      ) / 100000000;
  }

  next();
});

const paxfulModel = mongoose.model('PaxfulDeposit', paxfulSchema);

module.exports = paxfulModel;
