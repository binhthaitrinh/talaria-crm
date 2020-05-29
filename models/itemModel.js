const mongoose = require('mongoose');
const validator = require('validator');
const Transaction = require('./transactionModel');
const AppError = require('../utils/appError');

const itemSchema = mongoose.Schema({
  link: {
    type: String,
    required: [true, 'An Item must have a link'],
  },
  name: {
    type: String,
  },
  status: {
    type: String,
    enum: [
      'not-yet-ordered',
      'ordered',
      'on-the-way-to-warehouse',
      'on-the-way-to-viet-nam',
      'arrived-at-viet-nam',
      'done',
      'returning',
      'returned',
    ],
    default: 'not-yet-ordered',
  },
  pricePerItem: {
    type: Number,
    required: [true, 'An Item must have a price'],
  },
  tax: {
    type: mongoose.Decimal128,
    default: 0.0,
  },
  usShippingFee: {
    type: mongoose.Decimal128,
    default: 0.0,
  },
  shippingToVNFee: {
    type: mongoose.Decimal128,
    default: 0.0,
  },
  estimatedWeight: {
    type: mongoose.Decimal128,
    default: 0.0,
  },
  actualWeight: {
    type: mongoose.Decimal128,
    default: 0.0,
  },
  usVnRate: {
    type: Number,
    default: 23000,
  },
  costOfGoodsSold: {
    type: mongoose.Decimal128,
    default: 0.7,
  },
  quantity: {
    type: Number,
    default: 1,
  },
  trackingLink: String,
  orderedWebsite: {
    type: String,
    enum: ['amazon', 'ebay', 'sephora', 'bestbuy', 'costco', 'walmart'],
    default: 'amazon',
  },
  invoiceLink: String,
  orderAccount: {
    type: mongoose.Schema.ObjectId,
    ref: 'Account',
  },
  orderedDate: {
    type: Date,
    default: Date.now(),
  },
  arrivedAtWarehouseDate: {
    type: Date,
  },
  shippingToVnDate: {
    type: Date,
  },
  arrivedAtVnDate: {
    type: Date,
  },
  customerRcvedDate: {
    type: Date,
  },
  returnPkgArvlDate: {
    type: Date,
  },
  itemType: {
    type: String,
    enum: ['toys', 'electronics', 'cosmetics', 'accessories', 'others'],
  },
  notes: {
    type: String,
  },
});

itemSchema.methods.createTransaction = async function () {
  const { tax, usShippingFee, quantity, pricePerItem } = this;

  const totalCost =
    pricePerItem * quantity * (1 + parseFloat(tax)) + usShippingFee;

  let transaction = await Transaction.findOne({ itemID: this.id });

  if (transaction) {
    transaction = await Transaction.findByIdAndUpdate(transaction.id, {
      transactionType: 'outflow',
      amount: totalCost,
      accountID: this.orderAccount,
      itemID: this.id,
    });
  } else {
    transaction = await Transaction.create({
      transactionType: 'outflow',
      amount: totalCost,
      accountID: this.orderAccount,
      itemID: this.id,
    });
  }

  return transaction;
};

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
