const Account = require('../models/accountModel');
const Transaction = require('../models/transactionModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handleFactory');
const mongoose = require('mongoose');

exports.getAllAccounts = factory.getAll(Account);

// exports.getOneAccount = catchAsync(async (req, res, next) => {
//   const query = Account.findById(req.params.id);
//   query.populate({
//     path: 'transactions',
//     // select: 'transactionType amount gcCost ',
//   });
//   const account = await query;

//   console.log(account.transactions.length);

//   return res.status(200).json({
//     status: 'success',
//     data: {
//       data: account,
//     },
//   });
// });

exports.getOneAccount = factory.getOne(Account);

exports.getTransactions = catchAsync(async (req, res, next) => {
  const results = await Transaction.find({
    $or: [
      { fromAccount: mongoose.Types.ObjectId(req.params.id) },
      { toAccount: mongoose.Types.ObjectId(req.params.id) },
    ],
  }).sort({ createdAt: -1, _id: -1 });

  return res.status(200).json({
    status: 'success',
    results: results.length,
    data: {
      data: results,
    },
  });
});

exports.updateAccount = factory.updateOne(Account);
exports.deleteAccount = factory.deleteOne(Account);

exports.createAccount = factory.createOne(Account);
