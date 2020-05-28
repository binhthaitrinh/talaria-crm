const Transaction = require('../models/transactionModel');
const catchAsync = require('../utils/catchAsync');

exports.getAllTransactions = catchAsync(async (req, res, next) => {
  const transactions = await Transaction.find();

  res.status(200).json({
    status: 'success',
    results: transactions.length,
    data: {
      data: transactions,
    },
  });
});

exports.createTransaction = catchAsync(async (req, res, next) => {
  console.log('creating...');

  const transaction = await Transaction.create(req.body);

  res.status(200).json({
    status: 'success',
    data: {
      data: transaction,
    },
  });
});
