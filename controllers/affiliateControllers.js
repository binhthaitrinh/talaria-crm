const Affiliate = require('../models/affiliateModel');
const factory = require('./handleFactory');
const catchAsync = require('../utils/catchAsync');
const Bill = require('../models/billModel');
const mongoose = require('mongoose');

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
