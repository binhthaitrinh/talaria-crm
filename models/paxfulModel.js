const mongoose = require('mongoose');
const AppError = require('../utils/appError');
const Account = require('../models/accountModel');
const Transaction = require('../models/transactionModel');
const getNextSequence = require('../utils/getNextSequence');

const paxfulSchema = mongoose.Schema(
  {
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    btcAmount: {
      type: mongoose.Decimal128,
      required: [true, 'A Paxful deposit must have an amount'],
      min: [0, 'BTC amount cannot be negative'],
    },
    withdrawFee: {
      type: mongoose.Decimal128,
      default: 0,
    },
    amountSpent: {
      value: {
        type: mongoose.Decimal128,
        required: [true, 'You must have spent money to buy BTC'],
      },
      currency: {
        type: String,
        enum: ['vnd', 'usd'],
        default: 'vnd',
      },
    },

    usdVndRate: {
      type: mongoose.Decimal128,
      default: 23700,
    },
    btcUsdRate: {
      type: mongoose.Decimal128,
      default: 9500,
    },

    buyer: {
      type: String,
    },
    remainingBalance: {
      amount: {
        type: mongoose.Decimal128,
      },
      rating: {
        type: mongoose.Decimal128,
      },
    },
    btcAccountBalance: {
      type: mongoose.Decimal128,
    },
    btcAccount: {
      type: mongoose.Schema.ObjectId,
      ref: 'Account',
      required: [true, 'A paxful transaction must have a BTC account'],
    },
    fromAccount: {
      type: mongoose.Schema.ObjectId,
      ref: 'Account',
      required: [
        true,
        'Money spent to buy btc must have come from some where...',
      ],
    },
    pocketMoney: Boolean,
    notes: String,
    customId: {
      type: String,
      unique: true,
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

// paxfulSchema.pre(/find/, function (next) {
//   this.sort({ createdAt: -1 });

//   next();
// });

paxfulSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'btcAccount',
    select: 'balance loginID',
  });

  next();
});

paxfulSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'fromAccount',
    select: 'balance loginID',
  });

  next();
});

paxfulSchema.pre('save', async function (next) {
  const trans = await Transaction.create({
    fromAccount: this.fromAccount,
    toAccount: this.btcAccount,
    amountSpent: {
      value: this.amountSpent.value * 1,
      currency: this.amountSpent.currency,
    },
    amountSpentFee: {
      value: 0,
      currency: this.amountSpent.currency,
    },
    amountReceived: {
      value: this.btcAmount * 1,
      currency: 'btc',
    },
  });

  let vndSpent = this.amountSpent.value * 1;

  // convert to VND if currency is in USD
  if (this.amountSpent.currency === 'usd') {
    vndSpent =
      Math.round(this.amountSpent.value * 100 * this.usdVndRate * 100) / 10000;
  }

  // when created, remainingBalance = btcAmount
  this.remainingBalance.amount = this.btcAmount;

  // calculate btcVnd rating of this transaction
  this.remainingBalance.rating =
    Math.round(
      ((parseFloat(vndSpent) * 100000000) /
        (parseFloat(this.btcAmount) * 100000000 -
          parseFloat(this.withdrawFee) * 100000000)) *
        100000000
    ) / 100000000;

  // update account Balance
  this.btcAccountBalance = trans.toAcctBalance;

  next();
});

paxfulSchema.pre('save', async function (next) {
  const res = await getNextSequence('paxful');
  this.customId = `PAXFUL-TRANS-${res}`;

  next();
});

const paxfulModel = mongoose.model('PaxfulDeposit', paxfulSchema);

module.exports = paxfulModel;
