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

transactionSchema.statics.getStats = async function () {
  const totalTransactionAmount = await this.aggregate([
    {
      $group: {
        _id: '$transactionType',
        count: { $sum: 1 },
        totalMoneySpent: { $sum: '$amount' },
      },
    },
  ]);

  const amountReceived =
    totalTransactionAmount[0]._id === 'inflow'
      ? parseFloat(totalTransactionAmount[0].totalMoneySpent)
      : parseFloat(totalTransactionAmount[1].totalMoneySpent);

  const amountSpent =
    totalTransactionAmount[0]._id === 'outflow'
      ? parseFloat(totalTransactionAmount[0].totalMoneySpent)
      : parseFloat(totalTransactionAmount[1].totalMoneySpent);

  return {
    amountReceived,
    amountSpent,
  };
};

const transactionModel = mongoose.model('Transaction', transactionSchema);

module.exports = transactionModel;
