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
  gcCost: mongoose.Schema.ObjectId,
  notes: String,
  balance: mongoose.Schema.ObjectId,
});

const transactionModel = mongoose.model('Transaction', transactionSchema);

module.exports = transactionModel;
