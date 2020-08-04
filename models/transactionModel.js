const mongoose = require('mongoose');
const getNextSequence = require('../utils/getNextSequence');
const Account = require('./accountModel');

const transactionSchema = mongoose.Schema({
  transactionType: {
    type: String,
    enum: ['inflow', 'outflow'],
    required: [true, 'Transaction must have a type'],
  },
  amount: {
    type: mongoose.Decimal128,
    required: [true, 'Transaction must have an amount'],
  },
  currency: {
    type: String,
    enum: ['vnd', 'usd', 'btc'],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  account: {
    type: mongoose.Schema.ObjectId,
    ref: 'Account',
    // required: [true, 'Transaction must be associated with an account'],
  },
  item: {
    type: mongoose.Schema.ObjectId,
    ref: 'Item',
    // required: [true, 'Transaction must be associated with an item'],
  },
  bill: {
    type: mongoose.Schema.ObjectId,
    ref: 'Bill',
  },
  actualCost: mongoose.Decimal128,
  notes: String,
  balance: mongoose.Decimal128,
  customId: {
    type: String,
    unique: true,
  },
});

transactionSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'itemID',
    select: 'name _id quantity -orderAccount',
  });

  this.populate({
    path: 'accountID',
    select: 'loginID _id balance',
  });
  next();
});

transactionSchema.pre('save', async function (next) {
  const res = await getNextSequence('transaction');
  this.customId = `TRANSACTION-${res}`;

  next();
});

const transactionModel = mongoose.model('Transaction', transactionSchema);

module.exports = transactionModel;
