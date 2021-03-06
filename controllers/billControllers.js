const factory = require('./handleFactory');
const Bill = require('../models/billModel');
const Item = require('../models/itemModel');
const Compensation = require('../models/compensationModel');
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

exports.updateBillUponCreation = catchAsync(async (req, res, next) => {
  const bill = await Bill.findById(req.params.id);

  const { usdVndRate, moneyChargeCustomerUSD } = bill;

  const remaining =
    Math.round(usdVndRate * (100000000 * moneyChargeCustomerUSD)) / 100000000;

  const actualChargeCustomer = remaining;

  const data = await Bill.findOneAndUpdate(
    { _id: bill._id },
    {
      $set: {
        remaining,
        actualChargeCustomer,
      },
    },
    {
      returnOriginal: false,
    }
  );

  res.status(200).json({
    status: 'success',
    data: {
      data,
    },
  });
});

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

exports.calcCommission = catchAsync(async (req, res, next) => {
  const bill = await Bill.findById(req.params.id);

  console.log(bill);

  const doc = await Bill.calcCommission(bill);

  console.log(doc);
  return res.status(200).json({
    status: 'success',
    data: null,
  });
});

// TODO: add route for "creating" a bill
exports.fakeCreateBill = catchAsync(async (req, res, next) => {
  if (!req.body.affiliate) {
    return next(
      new AppError('There must be an affiliate associated with bill', 400)
    );
  }
  if (!req.body.usdVndRate) {
    return next(new AppError('There must be USD/VND rate', 400));
  }

  const doc = await Bill.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!doc) {
    return next(new AppError('No bill with that ID', 400));
  }

  if (doc.items) {
    await Item.calcBill(doc.items[0]);
  }

  const newBill = await Bill.calcCommission(doc);

  await Compensation.create({
    bill: doc._id,
    status: 'bill-not-paid',
    affiliate: req.body.affiliate,
    amount: newBill.commissionForAffiliate,
  });

  res.status(200).json({
    status: 'success',
    data: {
      data: newBill,
    },
  });
});
// TODO: double check calc affiliate commission
