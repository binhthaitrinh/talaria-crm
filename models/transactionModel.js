const mongoose = require('mongoose');

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
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  accountID: {
    type: mongoose.Schema.ObjectId,
    ref: 'Account',
    // required: [true, 'Transaction must be associated with an account'],
  },
  itemID: {
    type: mongoose.Schema.ObjectId,
    ref: 'Item',
    // required: [true, 'Transaction must be associated with an item'],
  },
  billID: {
    type: mongoose.Schema.ObjectId,
    ref: 'Bill',
  },
  gcCost: mongoose.Decimal128,
  notes: String,
  balance: mongoose.Decimal128,
});

transactionSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'itemID',
    select: 'name _id quantity -orderAccount',
  });

  this.populate({
    path: 'accountID',
    select: 'loginID _id',
  });
  next();
});

const transactionModel = mongoose.model('Transaction', transactionSchema);

module.exports = transactionModel;
