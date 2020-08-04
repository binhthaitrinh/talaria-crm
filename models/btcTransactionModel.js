const mongoose = require('mongoose');
const getNextSequence = require('../utils/getNextSequence');

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
  customId: {
    type: String,
    unique: true,
  },
});

btcTransactionSchema.pre('save', async function (next) {
  const res = await getNextSequence('btcTransaction');
  this.customId = `BTC-TRANS-${res}`;

  next();
});

const btcTransactionModel = mongoose.model(
  'btcTransaction',
  btcTransactionSchema
);

module.exports = btcTransactionModel;
