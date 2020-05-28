const Account = require('../models/accountModel');
const catchAsync = require('../utils/catchAsync');

exports.getAllAccounts = catchAsync(async (req, res, next) => {
  const accounts = await Account.find();

  return res.status(200).json({
    status: 'success',
    results: accounts.length,
    data: {
      data: accounts,
    },
  });
});

exports.getOneAccount = catchAsync(async (req, res, next) => {
  const query = Account.findById(req.params.id);
  query.populate({
    path: 'transactions',
    select: 'transactionType amount -accountID',
  });
  const account = await query;

  return res.status(200).json({
    status: 'success',
    data: {
      data: account,
    },
  });
});

exports.createAccount = (req, res, next) => {};
