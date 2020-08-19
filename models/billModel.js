const mongoose = require('mongoose');
const Transaction = require('./transactionModel');
const Customer = require('./customerModel');
const Account = require('./accountModel');
const Compensation = require('./compensationModel');
const AppError = require('../utils/appError');
const getNextSequence = require('../utils/getNextSequence');

const MUL = 100000000;

const billSchema = mongoose.Schema(
  {
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    // items: [
    //   {
    //     type: mongoose.Schema.ObjectId,
    //     ref: 'Item',
    //   },
    // ],
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
      //  required: [true, 'A bill must have an affiliate'],
    },
    status: {
      type: String,
      enum: ['not-paid', 'partially-paid', 'fully-paid'],
      default: 'not-paid',
    },

    estimatedWeight: mongoose.Decimal128,
    shippingRateToVnInUSD: {
      type: mongoose.Decimal128,
      default: 12,
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
    actualChargeCustomer: mongoose.Decimal128,

    // moneyChargeCustomerVND: mongoose.Decimal128,

    moneyTransferReceipt: String,
    customId: {
      type: String,
      unique: true,
    },
    notes: String,

    // actualCost: mongoose.Decimal128,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

billSchema.virtual('items', {
  ref: 'Item',
  foreignField: 'bill',
  localField: '_id',
});

billSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'customer',
    select: 'firstName lastName customerType discountRate address phoneNumber',
  });

  next();
});

billSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'items',
    select:
      'name quantity pricePerItem createdAt usShippingFee orderedWebsite estimatedWeight -orderAccount',
  });

  next();
});

billSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'affiliate',
    select: 'firstName lastName commissionRate',
  });

  next();
});

billSchema.pre('save', async function (next) {
  const res = await getNextSequence('bill');
  this.customId = `BILL-${res}`;

  next();
});

billSchema.post('save', async function () {
  await Compensation.create({
    bill: this._id,
    status: 'bill-not-paid',
    //  affiliate: this.affiliate,
  });
});

const billModel = mongoose.model('Bill', billSchema);

module.exports = billModel;
