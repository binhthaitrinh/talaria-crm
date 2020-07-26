const mongoose = require('mongoose');
const Transaction = require('./transactionModel');
const Item = require('./itemModel');
const Customer = require('./customerModel');

const billSchema = mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  items: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Item',
    },
  ],
  usdVndRate: {
    type: mongoose.Decimal128,
    required: [true, 'A bill must have usd/vnd rate'],
  },
  customer: {
    type: mongoose.Schema.ObjectId,
    ref: 'Customer',
    required: [true, 'A bill must belong to a customer'],
  },
  affiliate: {
    type: mongoose.Schema.ObjectId,
    ref: 'Affiliate',
    required: [true, 'A bill must have an affiliate'],
  },
  status: {
    type: String,
    enum: ['not-paid', 'partially-paid', 'fully-paid'],
    default: 'not-paid',
  },

  estimatedWeight: mongoose.Decimal128,
  shippingRateToVnInUSD: {
    type: mongoose.Decimal128,
    default: 12.5,
  },

  taxForCustomer: {
    type: mongoose.Decimal128,
    default: 0.0,
    min: [0, 'Tax cannot be negative'],
    max: [1, 'Tax cannot be more than 100%'],
  },
  moneyReceived: {
    type: mongoose.Decimal128,
    default: 0,
  },
  remaining: mongoose.Decimal128,
  actualBillCost: mongoose.Decimal128,
  moneyChargeCustomerUSD: mongoose.Decimal128,
  // moneyChargeCustomerVND: mongoose.Decimal128,

  moneyTransferReceipt: String,

  // actualCost: mongoose.Decimal128,
});

billSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'customer',
    select: 'customerName customerType',
  });

  next();
});

billSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'items',
    select: 'name quantity -orderAccount',
  });

  next();
});

billSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'affiliate',
    select: 'name',
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
                  1 - customer.discountRate,
                ],
              },
              {
                $multiply: [
                  this.taxForCustomer,
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
                    $add: [1, this.taxForCustomer],
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
  const shippingFeeToVnInUSD =
    Math.round(
      parseFloat(this.estimatedWeight) * 100 * 10 * this.shippingRateToVnInUSD
    ) / 1000;

  // calculate money to charge customer (include shipping fee)
  this.moneyChargeCustomerUSD =
    Math.round(
      shippingFeeToVnInUSD * 100000000 +
        parseFloat(result[0].moneyChargeCustomerUSD) * 100000000
    ) / 100000000;

  // calculate total gift card money + shipping fee to VN
  this.actualBillCost =
    Math.round(
      shippingFeeToVnInUSD * 100000000 +
        parseFloat(result[0].totalBillCost) * 100000000
    ) / 100000000;

  // this.moneyChargeCustomerVND =
  //   Math.round(this.usdVndRate * (100000000 * this.moneyChargeCustomerUSD)) /
  //   100000000;

  this.remaining =
    Math.round(this.usdVndRate * (100000000 * this.moneyChargeCustomerUSD)) /
    100000000;

  next();
});

billSchema.statics.customerPay = async function (id, amount) {
  // find the bill doc to be paid
  const bill = await this.findOne({ _id: id }).select(
    'moneyReceived remaining -items -customer'
  );

  // // update amountPaid
  // const moneyReceived = parseFloat(bill.moneyReceived) + parseFloat(amount);

  // update remaining
  const remaining =
    Math.round(
      parseFloat(bill.remaining) * 100000000 - parseFloat(amount) * 100000000
    ) / 100000000;

  const moneyReceived =
    Math.round(
      parseFloat(bill.moneyReceived) * 100000000 +
        parseFloat(amount) * 100000000
    ) / 100000000;

  await this.updateOne(
    { _id: id },
    {
      $set: {
        // moneyReceived,
        remaining,
        status: remaining > 0 ? 'partially-paid' : 'fully-paid',
        moneyReceived,
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
