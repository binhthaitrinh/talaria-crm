const mongoose = require('mongoose');
const AppError = require('../utils/appError');
const Account = require('../models/accountModel');
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
    usdVndRate: {
      type: mongoose.Decimal128,
      default: 23700,
    },
    btcUsdRate: {
      type: mongoose.Decimal128,
      default: 9500,
    },
    moneySpent: {
      amount: {
        type: mongoose.Decimal128,
      },
      currency: {
        type: String,
        enum: ['vnd', 'usd'],
        default: 'vnd',
      },
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
    totalBalance: {
      type: mongoose.Decimal128,
    },
    btcAccount: {
      type: mongoose.Schema.ObjectId,
      ref: 'Account',
      required: [true, 'A paxful transaction must have a BTC account'],
    },
    transactionType: {
      type: String,
      enum: ['inflow', 'outflow'],
      required: [true, 'A paxful transaction must have a type'],
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
    select: 'balance',
  });

  next();
});

paxfulSchema.pre('save', async function (next) {
  const res = await getNextSequence('paxful');
  this.customId = `PAXFUL-TRANS-${res}`;

  next();
});

paxfulSchema.pre('save', async function (next) {
  if (this.transactionType === 'inflow') {
    // convert to VND if currency is in USD
    if (this.moneySpent.currency === 'usd') {
      this.moneySpent.amount =
        Math.round(this.moneySpent.amount * 100 * this.usdVndRate * 100) /
        10000;
      this.moneySpent.currency = 'vnd';
    }

    // when created, remainingBalance = btcAmount
    this.remainingBalance.amount = parseFloat(this.btcAmount);

    // calculate btcVnd rating of this transaction
    this.remainingBalance.rating =
      Math.round(
        ((parseFloat(this.moneySpent.amount) * 100000000) /
          (parseFloat(this.btcAmount) * 100000000 -
            parseFloat(this.withdrawFee) * 100000000)) *
          100000000
      ) / 100000000;
  }

  // update BTC account balance
  const btcAccount = await Account.findOneAndUpdate(
    { _id: this.btcAccount },
    {
      $inc: {
        balance: this.btcAmount * (this.transactionType === 'inflow' ? 1 : -1),
      },
    }
  );

  // update VND account balance
  if (this.transactionType === 'inflow') {
    const vndAccount = await Account.findOneAndUpdate(
      { loginID: 'VND_ACCOUNT' },
      {
        $inc: {
          balance: this.moneySpent.amount * -1,
        },
      }
    );
  }

  // const btcAccount = await Account.findById(this.btcAccount);

  // if (this.transactionType === 'inflow') {
  //   btcAccount.balance =
  //     Math.round(
  //       parseFloat(btcAccount.balance) * 100000000 +
  //         parseFloat(this.btcAmount) * 100000000
  //     ) / 100000000;
  // } else if (this.transactionType === 'outflow') {
  //   btcAccount.balance =
  //     Math.round(
  //       parseFloat(btcAccount.balance) * 100000000 -
  //         parseFloat(this.btcAmount) * 100000000
  //     ) / 100000000;
  // }

  this.totalBalance = btcAccount.balance;

  // await btcAccount.save();

  next();
});

const paxfulModel = mongoose.model('PaxfulDeposit', paxfulSchema);

module.exports = paxfulModel;
