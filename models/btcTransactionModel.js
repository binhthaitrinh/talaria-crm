const mongoose = require('mongoose');

const btcTransactionSchema = mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  amount: {
    type: mongoose.Decimal128,
    required: [true, 'A transaction must have '],
  },
  transactionType: {
    type: String,
    enum: ['inflow, outflow'],
  },
});

const btcTransactionModel = mongoose.model(
  'btcTransaction',
  btcTransactionSchema
);

module.exports = btcTransactionModel;
