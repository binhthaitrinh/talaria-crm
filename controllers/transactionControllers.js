const Transaction = require('../models/transactionModel');
const catchAsync = require('../utils/catchAsync');

exports.getAllTransactions = (req, res, next) => {};

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
