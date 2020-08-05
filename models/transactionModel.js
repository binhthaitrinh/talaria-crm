const mongoose = require('mongoose');
const getNextSequence = require('../utils/getNextSequence');
const Account = require('./accountModel');

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
    value: {
      type: mongoose.Decimal128,
      default: 0,
    },
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
  next();
});

transactionSchema.pre('save', async function (next) {
  const res = await getNextSequence('transaction');
  this.customId = `TRANSACTION-${res}`;

  next();
});

transactionSchema.pre('save', async function (next) {
  console.log(this);
  if (this.fromAccount) {
    const from = await Account.findOneAndUpdate(
      {
        _id: mongoose.Types.ObjectId(this.fromAccount),
        currency: this.amountSpent.currency,
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

    this.fromAcctBalance = from.balance;
  }

  if (this.toAccount) {
    const to = await Account.findOneAndUpdate(
      { _id: this.toAccount, currency: this.amountReceived.currency },
      {
        $inc: {
          balance: this.amountReceived.value * 1,
        },
      }
    );

    this.toAcctBalance = to.balance;
  }

  next();
});

const transactionModel = mongoose.model('Transaction', transactionSchema);

module.exports = transactionModel;
