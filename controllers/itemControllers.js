const Item = require('../models/itemModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handleFactory');

exports.getAllItems = factory.getAll(Item);

exports.createItem = catchAsync(async (req, res, next) => {
  const item = await Item.create(req.body);

  res.status(200).json({
    status: 'success',
    data: {
      data: item,
    },
  });
});

exports.chargeMoney = catchAsync(async (req, res, next) => {
  const transaction = await Item.createTransaction(req.params.id);

  if (transaction.statusCode && transaction.statusCode === 400) {
    return next(transaction);
  }

  res.status(200).json({
    status: 'success',
    data: {
      data: transaction,
    },
  });
});

exports.updateCostInfo = catchAsync(async (req, res, next) => {
  const item = await Item.findById(req.params.id).select(
    'tax usShippingFee shippingToVnFee estimatedWeight quantity pricePerItem'
  );

  // update cost info
  item.tax = req.body.tax || item.tax;
  item.usShippingFee = req.body.usShippingFee || item.usShippingFee;
  item.shippingToVNFee = req.body.shippingToVNFee || item.shippingToVNFee;
  item.estimatedWeight = req.body.estimatedWeight || item.estimatedWeight;
  item.quantity = req.body.quantity || item.quantity;
  item.pricePerItem = req.body.pricePerItem || item.pricePerItem;

  await item.save();

  res.status(200).json({
    status: 'success',
  });
});

exports.updateOne = factory.updateOne(Item);

exports.getOneItem = factory.getOne(Item);
