const mongoose = require('mongoose');
const AppError = require('../utils/appError');
const Transaction = require('./transactionModel');
const Item = require('./itemModel');
const Customer = require('./customerModel');

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
  status: {
    type: String,
    enum: ['not-paid', 'partially-paid', 'fully-paid'],
    default: 'not-paid',
  },
  estimatedWeight: mongoose.Decimal128,
  moneyReceived: {
    type: mongoose.Decimal128,
    default: 0,
  },
  remaining: mongoose.Decimal128,
  moneyChargeCustomerUSD: mongoose.Decimal128,
  moneyChargeCustomerVND: mongoose.Decimal128,
  shippingRateToVnInUSD: {
    type: mongoose.Decimal128,
    default: 12.5,
  },

  shippingFeeToVnInUSD: mongoose.Decimal128,
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
  const customer = await Customer.findById(this.customer).select(
    'discountRate'
  );

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
        moneyChargeCustomerUSD: {
          $sum: {
            $add: [
              '$usShippingFee',
              {
                $multiply: [
                  '$pricePerItem',
                  '$quantity',
                  (100 - customer.discountRate) / 100,
                ],
              },
              {
                $multiply: [
                  '$taxForCustomer',
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
            ],
          },
        },
        totalBillCost: {
          $sum: {
            $add: [
              '$usShippingFee',
              {
                $multiply: [
                  '$pricePerItem',
                  '$quantity',
                  {
                    $add: [1, '$taxForCustomer'],
                  },
                ],
              },
            ],
          },
        },
      },
    },
  ]);

  // calculate total bill estimated weight
  this.estimatedWeight = result[0].totalEstimatedWeight;

  // calculate shipping fee to VN
  this.shippingFeeToVnInUSD =
    Math.round(
      parseFloat(this.estimatedWeight) * 100 * 10 * this.shippingRateToVnInUSD
    ) / 1000;

  // calculate money to charge customer (include shipping fee)
  this.moneyChargeCustomerUSD =
    Math.round(
      this.shippingFeeToVnInUSD * 100000000 +
        parseFloat(result[0].moneyChargeCustomerUSD) * 100000000
    ) / 100000000;

  // calculate total gift card money + shipping fee to VN
  this.totalBillInUsd =
    Math.round(
      this.shippingFeeToVnInUSD * 100000000 +
        parseFloat(result[0].totalBillCost) * 100000000
    ) / 100000000;

  this.moneyChargeCustomerVND =
    Math.round(this.vndUsdRate * (100000000 * this.moneyChargeCustomerUSD)) /
    100000000;

  this.remaining = this.moneyChargeCustomerVND;

  next();
});

billSchema.statics.customerPay = async function (id, amount) {
  // find the bill doc to be paid
  const bill = await this.findOne({ _id: id }).select(
    'moneyReceived remaining -items -customer'
  );

  // update amountPaid
  const moneyReceived = parseFloat(bill.moneyReceived) + amount;

  // update remaining
  const remaining =
    Math.round(parseFloat(bill.remaining) * 100000000 - amount * 100000000) /
    100000000;

  await this.updateOne(
    { _id: id },
    {
      $set: {
        moneyReceived,
        remaining,
        status: remaining > 0 ? 'partially-paid' : 'fully-paid',
      },
    }
  );

  const transaction = await Transaction.create({
    transactionType: 'inflow',
    amount,
    billID: bill.id,
  });

  // update bill status
  return transaction;
};

const billModel = mongoose.model('Bill', billSchema);

module.exports = billModel;
