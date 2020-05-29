const mongoose = require('mongoose');

const giftCardSchema = mongoose.Schema({
  giftCardType: {
    type: String,
    enum: ['amazon', 'sephora', 'ebay', 'bestbuy', 'costco', 'others'],
    required: [true, 'Gift card deposit must have a type'],
  },
  accountID: {
    type: mongoose.Schema.ObjectId,
    ref: 'Account',
    required: [true, 'Gift card deposit must have an account ID'],
  },
  timeBuy: {
    type: Date,
    default: Date.now(),
  },
  priceInBTC: {
    type: mongoose.Decimal128,
    required: [true, 'Gift card deposit must have a price in BTC'],
  },
  feeBTC: {
    type: mongoose.Decimal128,
    default: 0.0,
  },
  btcUsdRate: {
    type: mongoose.Decimal128,
    required: [true, 'Gift card deposit must have exchange rate'],
  },
  vndUsdRate: {
    type: mongoose.Decimal128,
    default: 23600,
  },
  giftCardValue: {
    type: Number,
    required: [true, 'Gift card deposit must have value'],
  },
  hardCardPic: String,
  receiptPic: String,
  discountRate: mongoose.Decimal128,
});

const giftCardModel = mongoose.model('GiftCard', giftCardSchema);

module.exports = giftCardModel;
