const mongoose = require('mongoose');
const validator = require('validator');

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
    type: Number,
    default: 0.0,
  },
  usShippingFee: {
    type: Number,
    default: 0.0,
  },
  shippingToVNFee: {
    type: Number,
    default: 0.0,
  },
  estimatedWeight: {
    type: Number,
    default: 0.0,
  },
  actualWeight: {
    type: Number,
    default: 0.0,
  },
  usVnRate: {
    type: Number,
    default: 23000,
  },
  costOfGoodSold: {
    type: Number,
    default: 0.7,
  },
  quantiy: {
    type: Number,
    default: 1,
  },
  orderedWebsite: {
    type: String,
    enum: ['amazon', 'ebay', 'sephora', 'bestbuy', 'costco', 'walmart'],
    default: 'amazon',
  },
  invoiceLink: String,
  // orderAccount
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

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
