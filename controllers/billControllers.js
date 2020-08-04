const factory = require('./handleFactory');
const Bill = require('../models/billModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.createBill = factory.createOne(Bill);

exports.getAllBill = factory.getAll(Bill);

exports.getBill = factory.getOne(Bill);

exports.customerPay = catchAsync(async (req, res, next) => {
  if (req.body.amount < 0) {
    return next(new AppError('Amount must be positive', 400));
  }
  const data = await Bill.customerPay(req.params.id, req.body.amount);

  if (data.statusCode && data.statusCode === 400) {
    return next(data);
  }

  res.status(200).json({
    status: 'success',
    data: {
      data,
    },
  });
});

exports.deleteBill = factory.deleteOne(Bill);

exports.updateBill = factory.updateOne(Bill);

exports.updatePrice = catchAsync(async (req, res, next) => {
  const doc = await Bill.findById(req.params.id).select('_id moneyReceived');

  const newBill = await Bill.findOneAndUpdate(
    { _id: doc._id },
    {
      $set: {
        remaining:
          Math.round(
            req.body.newPrice * 100000000 -
              parseFloat(doc.moneyReceived) * 100000000
          ) / 100000000,
        actualChargeCustomer: req.body.newPrice,
      },
    },
    {
      returnOriginal: false,
    }
  );

  res.status(200).json({
    status: 'success',
    data: {
      data: newBill,
    },
  });
});
