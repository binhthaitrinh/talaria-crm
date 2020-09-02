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

// exports.updateCostInfo = catchAsync(async (req, res, next) => {
//   const item = await Item.findById(req.params.id).select(
//     'tax usShippingFee shippingToVnFee estimatedWeightPerItemPerItem quantity pricePerItem'
//   );

//   // update cost info
//   item.tax = req.body.tax || item.tax;
//   item.usShippingFee = req.body.usShippingFee || item.usShippingFee;
//   item.shippingToVNFee = req.body.shippingToVNFee || item.shippingToVNFee;
//   item.estimatedWeightPerItem = req.body.estimatedWeightPerItem || item.estimatedWeightPerItem;
//   item.quantity = req.body.quantity || item.quantity;
//   item.pricePerItem = req.body.pricePerItem || item.pricePerItem;

//   await item.save();

//   res.status(200).json({
//     status: 'success',
//   });
// });

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

// for refund
exports.refund = catchAsync(async (req, res, next) => {
  // new items created have status of refunded (same as req.body.itemID)
  const currentItem = await Item.findById(req.params.id);

  if (currentItem.status === 'not-yet-ordered') {
    return next(new AppError('This item hasnot been bought, so cannot return'));
  }

  // await Item.findByIdAndUpdate(req.params.id, { status: 'refunded' });

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
      (parseFloat(currentItem.actualPricePerItem) *
        parseFloat(req.body.quantity) +
        parseFloat(currentItem.usShippingFee)) *
      (1 + parseFloat(currentItem.tax)),
    giftCardType: currentItem.orderedWebsite,
    toAccount: currentItem.orderAccount._id,
    remainingBalance:
      (parseFloat(currentItem.actualPricePerItem) *
        parseFloat(req.body.quantity) +
        parseFloat(currentItem.usShippingFee)) *
      (1 + parseFloat(currentItem.tax)),
    partialBalance: [
      {
        actualCostRate:
          parseFloat(currentItem.actualCost) /
          ((parseFloat(currentItem.actualPricePerItem) *
            parseFloat(currentItem.quantity) +
            parseFloat(currentItem.usShippingFee)) *
            (1 + parseFloat(currentItem.tax))),
        remainingBalance:
          (parseFloat(currentItem.actualPricePerItem) *
            parseFloat(currentItem.quantity) +
            parseFloat(currentItem.usShippingFee)) *
          (1 + parseFloat(currentItem.tax)),
      },
    ],
  });

  // create transaction
  res.status(204).json({
    status: 'success',
  });
});

exports.split = catchAsync(async (req, res, next) => {
  const { quantity } = req.body;
  const { id } = req.params;

  const current = await Item.findById(id);

  if (current.quantity < quantity) {
    return next(new AppError('cannot split like this', 400));
  }

  const promises = [];

  promises.push(
    Item.create({
      link: current.link,
      name: current.name,
      status: current.status,
      pricePerItem: current.pricePerItem,
      tax: current.tax,
      usShippingFee: current.usShippingFee,
      estimatedWeightPerItem: current.estimatedWeightPerItem,
      actuelWeightPerItem: current.actuelWeightPerItem,
      actualCost:
        (parseFloat(current.actualCost) * parseFloat(quantity)) /
        parseFloat(current.quantity),
      quantity: quantity,
      orderedWebsite: current.orderedWebsite,
      itemType: current.itemType,
      notes: current.notes,
      bill: current.bill,
      warehouse: current.warehouse,
      chargeable: current.chargeable,
    })
  );
  promises.push(
    Item.findByIdAndUpdate(id, {
      quantity: current.quantity - quantity,
      actualCost:
        (parseFloat(current.actualCost) *
          (parseFloat(current.quantity) - parseFloat(quantity))) /
        parseFloat(current.quantity),
    })
  );

  await Promise.all(promises);

  res.status(201).json({
    status: 'success',
  });
});

exports.duplicate = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const current = await Item.findById(id);

  const item = await Item.create({
    link: current.link,
    name: current.name,
    status: current.status,
    pricePerItem: current.pricePerItem,
    tax: current.tax,
    usShippingFee: current.usShippingFee,
    estimatedWeightPerItem: current.estimatedWeightPerItem,
    actuelWeightPerItem: current.actuelWeightPerItem,
    actualCost: current.actualCost,
    quantity: current.quantity,
    orderedWebsite: current.orderedWebsite,
    itemType: current.itemType,
    notes: current.notes,
    bill: current.bill,
    warehouse: current.warehouse,
    chargeable: current.chargeable,
  });

  res.status(201).json({
    status: 'success',
    data: item,
  });
});

exports.generousSeller = catchAsync(async (req, res, next) => {
  const { quantity } = req.body;
  const item = await Item.findById(req.params.id);

  await Item.create({
    link: item.link,
    name: item.name,
    status: 'in-inventory',
    pricePerItem: item.pricePerItem,
    tax: item.tax,
    usShippingFee: item.usShippingFee,
    estimatedWeightPerItem: item.estimatedWeightPerItem,
    actuelWeightPerItem: item.actuelWeightPerItem,
    actualCost: 0,
    quantity: quantity,
    orderedWebsite: item.orderedWebsite,
    itemType: item.itemType,
    notes: `generous offer from bill ${item.bill}`,
    warehouse: item.warehouse,
  });

  res.status(201).json({
    status: 'success',
  });
});
