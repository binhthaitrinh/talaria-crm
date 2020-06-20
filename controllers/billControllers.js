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

  res.status(200).json({
    status: 'success',
    data: {
      data,
    },
  });
});

exports.deleteBill = factory.deleteOne(Bill);

exports.updateBill = factory.updateOne(Bill);
