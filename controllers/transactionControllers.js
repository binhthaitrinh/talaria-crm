const Transaction = require('../models/transactionModel');
const Bill = require('../models/billModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handleFactory');

exports.getAllTransactions = factory.getAll(Transaction);

exports.createTransaction = factory.createOne(Transaction);

exports.getStats = catchAsync(async (req, res, next) => {
  const totalTransactionAmount = await Transaction.aggregate([
    {
      $group: {
        _id: '$transactionType',
        count: { $sum: 1 },
        totalMoneySpent: { $sum: '$amount' },
      },
    },
  ]);

  const totalRevenue = await Bill.aggregate([
    {
      $group: {
        _id: null,
        count: { $sum: 1 },
        total: { $sum: '$moneyChargeCustomerVND' },
      },
    },
  ]);

  // TODO: fix when only outflow or inflow, not both

  const amountReceived =
    totalTransactionAmount[0]._id === 'inflow'
      ? parseFloat(totalTransactionAmount[0].totalMoneySpent)
      : parseFloat(totalTransactionAmount[1].totalMoneySpent);

  const amountSpent =
    totalTransactionAmount[0]._id === 'outflow'
      ? parseFloat(totalTransactionAmount[0].totalMoneySpent)
      : parseFloat(totalTransactionAmount[1].totalMoneySpent);

  const profit = amountReceived - amountSpent;

  res.status(200).json({
    status: 'success',
    data: {
      data: {
        amountReceived,
        amountSpent,
        totalRevenue: parseFloat(totalRevenue[0].total),
        profit,
      },
    },
  });
});
