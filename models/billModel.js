const mongoose = require('mongoose');
const AppError = require('../utils/appError');
const Item = require('./itemModel');

const billSchema = mongoose.Schema({
  date: {
    type: Date,
    default: Date.now(),
  },
  affiliate: {
    type: mongoose.Schema.ObjectId,
    ref: 'Affiliate',
  },
  items: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Item',
    },
  ],
  totalBillInUsd: mongoose.Decimal128,
  vndUsdRate: mongoose.Decimal128,
  estimatedWeight: mongoose.Decimal128,
  actualWeight: mongoose.Decimal128,
  moneyReceived: mongoose.Decimal128,
  shippingFeeInUSD: mongoose.Decimal128,
  shippingFeeInVND: mongoose.Decimal128,
  status: {
    type: String,
    enum: ['not-paid', 'partially-paid', 'fullypaid'],
    default: 'not-paid',
  },
  moneyTransferReceipt: String,
  customer: {
    type: mongoose.Schema.ObjectId,
    ref: 'Customer',
  },
  actualCost: mongoose.Decimal128,
  totalGcCost: mongoose.Decimal128,
  totalGcCostInVnd: mongoose.Decimal128,
});

billSchema.pre('save', async function (next) {
  if (this.items.length === 0)
    return next(new AppError('items cannot be empty', 400));

  const items = [];

  this.items.forEach((item) =>
    items.push(Item.aggregate([{ $match: { _id: item } }]))
  );

  const results = await Promise.all(items);
  console.log(results[0][0]);

  let estimatedWeight = 0;
  let actualWeight = 0;
  let actualCost = 0;
  let totalGcCost = 0;
  let gcCost = 0;
  results[0].forEach((item) => {
    estimatedWeight =
      Math.round(
        item.estimatedWeight * 100000000 + estimatedWeight * 100000000
      ) / 100000000;
    actualWeight =
      Math.round(
        item.estimatedWeight * 100000000 + estimatedWeight * 100000000
      ) / 100000000;
    actualCost =
      Math.round(item.actualCost * 100000000 + actualCost * 100000000) /
      100000000;
    gcCost =
      Math.round(
        (gcCost * 100000000 +
          item.quantity *
            (item.pricePerItem * 100000000) *
            Math.round(1 * 100000000 + item.tax * 100000000)) /
          100000000 +
          item.usShippingFee * 100000000
      ) / 100000000;
  });
  totalGcCost =
    Math.round(
      gcCost * 100000000 +
        Math.round(
          estimatedWeight * 100000000 * (this.shippingFeeInUSD * 100000000)
        ) /
          100000000
    ) / 100000000;

  console.log(totalGcCost);
  this.totalGcCost = totalGcCost;
  this.actualCost = actualCost;
  this.estimatedWeight = estimatedWeight;
  this.actualWeight = actualWeight;
  this.totalGcCostInVnd =
    Math.round(parseFloat(this.vndUsdRate) * totalGcCost * 100000000) /
    100000000;

  next();
});

const billModel = mongoose.model('Bill', billSchema);

module.exports = billModel;
