const Item = require('../models/itemModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handleFactory');
const AppError = require('../utils/appError');
const Giftcard = require('../models/giftCardModel');

exports.getAllItems = factory.getAll(Item);

exports.createItem = factory.createOne(Item);

exports.chargeMoney = catchAsync(async (req, res, next) => {
  const transaction = await Item.createTransaction(
    req.params.id,
    req.body.account
  );

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

exports.deleteOne = catchAsync(async (req, res, next) => {
  const doc = await Item.findByIdAndDelete(req.params.id);

  if (!doc) {
    return next(new AppError('No document found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

// for refund without return
exports.refund = catchAsync(async (req, res, next) => {
  // split items based on number of refunded item on req.body
  // new items created have status of refunded (same as req.body.itemID)
  const currentItem = await Item.findById(req.body.itemID);

  await Item.create({
    link: currentItem.link,
    name: currentItem.name,
    status: 'refunded',
    pricePerItem: currentItem.pricePerItem,
    tax: currentItem.tax,
    usShippingFee: currentItem.usShippingFee,
    estimatedWeight: currentItem.estimatedWeight,
    actualWeight: currentItem.actualWeight,
    quantity: req.body.quantity,
    orderedWebsite: currentItem.orderedWebsite,
    invoiceLink: currentItem.invoiceLink,
    orderAccount: currentItem.orderAccount._id,
    notes: `refund for bill id ${currentItem.bill._id}`,
  });

  // create gift card
  await Giftcard.create({
    price: {
      value: 0,
      currency: 'usd',
    },
    fee: {
      value: 0,
      currency: 'usd',
    },
    giftCardValue:
      parseFloat(currentItem.pricePerItem) *
      parseFloat(req.body.quantity) *
      (1 + parseFloat(currentItem.tax)),
    giftCardType: currentItem.orderedWebsite,
    partialBalance: currentItem.partialBalance,
    toAccount: currentItem.account._id,
  });

  // create transaction
});
