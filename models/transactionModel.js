const mongoose = require('mongoose');
const getNextSequence = require('../utils/getNextSequence');
const Account = require('./accountModel');
const AppError = require('../utils/appError');

const transactionSchema = mongoose.Schema({
  customId: {
    type: String,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  fromAccount: {
    type: mongoose.Schema.ObjectId,
    ref: 'Account',
  },
  toAccount: {
    type: mongoose.Schema.ObjectId,
    ref: 'Account',
  },
  amountSpent: {
    value: mongoose.Decimal128,
    currency: {
      type: String,
      enum: ['vnd', 'btc', 'usd'],
    },
  },
  amountSpentFee: {
    value: mongoose.Decimal128,
    currency: {
      type: String,
      enum: ['vnd', 'btc', 'usd'],
    },
  },
  amountReceived: {
    value: mongoose.Decimal128,
    currency: {
      type: String,
      enum: ['vnd', 'btc', 'usd'],
    },
  },
  fromAcctBalance: mongoose.Decimal128,
  toAcctBalance: mongoose.Decimal128,
  item: {
    type: mongoose.Schema.ObjectId,
    ref: 'Item',
  },
  bill: {
    type: mongoose.Schema.ObjectId,
    ref: 'Bill',
  },
  affiliate: {
    type: mongoose.Schema.ObjectId,
    ref: 'Affiliate',
  },
  notes: String,
});

transactionSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'item',
    select: 'name _id quantity -orderAccount',
  });

  this.populate({
    path: 'bill',
    select: '-items -customer -affiliate',
  });

  this.populate({
    path: 'fromAccount',
    select: 'loginID customId currency accountWebsite',
  });
  this.populate({
    path: 'toAccount',
    select: 'loginID customId currency accountWebsite',
  });
  next();
});

transactionSchema.pre('save', async function (next) {
  if (this.fromAccount) {
    try {
      const from = await Account.findOneAndUpdate(
        {
          _id: mongoose.Types.ObjectId(this.fromAccount),
          currency: this.amountSpent.currency,
          balance: {
            $gt:
              Math.round(
                this.amountSpent.value * 100000000 +
                  this.amountSpentFee.value * 100000000
              ) / 100000000,
          },
        },
        {
          $inc: {
            balance:
              (Math.round(
                this.amountSpent.value * 100000000 +
                  this.amountSpentFee.value * 100000000
              ) /
                100000000) *
              -1,
          },
        },
        { returnOriginal: false }
      );
      this.fromAcctBalance = from.balance * 1;
    } catch (err) {
      return next(new AppError('from account not found', 400));
    }

    // if (!from) return next(new AppError('from account not found', 400));
  }

  if (this.toAccount) {
    try {
      const to = await Account.findOneAndUpdate(
        {
          _id: mongoose.Types.ObjectId(this.toAccount),
          currency: this.amountReceived.currency,
        },
        {
          $inc: {
            balance: this.amountReceived.value * 1,
          },
        },
        { returnOriginal: false }
      );

      this.toAcctBalance = to.balance;
    } catch (err) {
      return next(new AppError('to account not found', 400));
    }
  }

  next();
});

transactionSchema.pre('save', async function (next) {
  const res = await getNextSequence('transaction');
  this.customId = `TRANSACTION-${res}`;

  next();
});

const transactionModel = mongoose.model('Transaction', transactionSchema);

module.exports = transactionModel;
