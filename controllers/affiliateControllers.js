const Affiliate = require('../models/affiliateModel');
const factory = require('./handleFactory');
const catchAsync = require('../utils/catchAsync');
const Bill = require('../models/billModel');
const mongoose = require('mongoose');
const Compensation = require('../models/compensationModel');
const Transaction = require('../models/transactionModel');
const Account = require('../models/accountModel');

exports.getAllAffiliate = factory.getAll(Affiliate);

exports.createAffiliate = factory.createOne(Affiliate);

exports.getOneAffiliate = factory.getOne(Affiliate);

exports.updateAffiliate = factory.updateOne(Affiliate);

exports.calcCommission = catchAsync(async (req, res, next) => {
  const current = await Affiliate.findOne({ _id: req.params.id }).select(
    'commissionRate'
  );

  const commissionRate = parseFloat(current.commissionRate);

  const bills = await Bill.aggregate([
    {
      $match: {
        affiliate: mongoose.Types.ObjectId(req.params.id),
      },
    },
    {
      $project: {
        _id: 1,
        moneyChargeCustomerUSD: 1,
      },
    },
  ]);

  let totalMoneyCharge = 0;
  bills.forEach((bill) => {
    totalMoneyCharge +=
      Math.round(
        totalMoneyCharge * 100000000 +
          parseFloat(bill.moneyChargeCustomerUSD) * 100000000
      ) / 100000000;
  });

  const totalCommission = totalMoneyCharge * commissionRate;

  res.status(200).json({
    status: 'success',
    data: {
      totalCommission,
      bills,
    },
  });
});

exports.payCommission = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;
  const month = req.params.month * 1;
  const compensations = await Compensation.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(`${year}-${month}-01`),
          $lte: new Date(),
        },
        status: {
          $eq: 'pending',
        },
        affiliate: mongoose.Types.ObjectId(req.params.id),
      },
    },
  ]);

  console.log(compensations);
  console.log(req.params.id);

  let totalAmount = 0;
  compensations.forEach((comp) => {
    totalAmount =
      Math.round(
        totalAmount * 100000000 + parseFloat(comp.amount) * 100000000
      ) / 100000000;
  });

  await Transaction.create({
    fromAccount: '5f24a4e06666190fbdf6e7bc',

    amountSpent: {
      value: totalAmount,
      currency: 'vnd',
    },
    amountSpentFee: {
      value: 0,
      currency: 'vnd',
    },
    affiliate: req.params.id,
  });

  const idList = compensations.map((comp) => comp._id);

  await Compensation.updateMany(
    { _id: { $in: idList } },
    {
      $set: {
        status: 'paid',
      },
    }
  );

  res.status(200).json({
    status: 'success',
    data: {
      paidAmount: totalAmount,
    },
  });
});
