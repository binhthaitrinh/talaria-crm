const Account = require('../models/accountModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handleFactory');

exports.getAllAccounts = factory.getAll(Account);

exports.getOneAccount = catchAsync(async (req, res, next) => {
  const query = Account.findById(req.params.id);
  query.populate({
    path: 'transactions',
    select: 'transactionType amount gcCost -accountID',
  });
  const account = await query;

  return res.status(200).json({
    status: 'success',
    data: {
      data: account,
    },
  });
});

exports.updateAccount = factory.updateOne(Account);
exports.deleteAccount = factory.deleteOne(Account);

exports.createAccount = factory.createOne(Account);
