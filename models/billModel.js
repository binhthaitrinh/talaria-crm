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
  totalBillInVnd: mongoose.Decimal128,
  vndUsdRate: mongoose.Decimal128,
  status: {
    type: String,
    enum: ['not-paid', 'partially-paid', 'fullypaid'],
    default: 'not-paid',
  },
  estimatedWeight: mongoose.Decimal128,
  moneyReceived: {
    type: mongoose.Decimal128,
    default: 0,
  },
  remaining: mongoose.Decimal128,
  moneyChargeCustomer: mongoose.Decimal128,
  shippingFeeToVnInUSD: {
    type: mongoose.Decimal128,
    default: 12.5,
  },
  shippingFeeInVND: {
    type: mongoose.Decimal128,
    default: function () {
      return (
        Math.round(this.shippingFeeToVnInUSD * 100 + this.vndUsdRate * 100) /
        100
      );
    },
  },
  moneyTransferReceipt: String,
  customer: {
    type: mongoose.Schema.ObjectId,
    ref: 'Customer',
  },
  actualCost: mongoose.Decimal128,
  profit: mongoose.Decimal128,
});

billSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'customer',
  });

  next();
});

billSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'items',
    select: 'name pricePerItem quantity -orderAccount',
  });

  next();
});

billSchema.pre('save', async function (next) {
  const result = await Item.aggregate([
    {
      $match: {
        _id: {
          $in: this.items,
        },
      },
    },
    {
      $group: {
        _id: null,
        totalEstimatedWeight: {
          $sum: '$estimatedWeight',
        },
        moneyChargeCustomer: {
          $sum: {
            $add: [
              '$usShippingFee',
              {
                $multiply: ['$pricePerItem', '$quantity', 0.82],
              },
              {
                $multiply: [
                  '$tax',
                  {
                    $add: [
                      '$usShippingFee',
                      {
                        $multiply: ['$pricePerItem', '$quantity'],
                      },
                    ],
                  },
                ],
              },
              // {
              //   $multiply: [
              //     '$pricePerItem',
              //     '$quantity',
              //     0.82,
              //     {
              //       $add: [1, '$taxForCustomer'],
              //     },
              //   ],
              // },
            ],
          },
        },
      },
    },
  ]);

  this.estimatedWeight = result[0].totalEstimatedWeight;
  this.moneyChargeCustomer =
    Math.round(
      parseFloat(this.estimatedWeight) *
        100000000 *
        parseFloat(this.shippingFeeToVnInUSD) +
        parseFloat(result[0].moneyChargeCustomer) * 100000000
    ) / 100000000;
  next();
});

const billModel = mongoose.model('Bill', billSchema);

module.exports = billModel;
