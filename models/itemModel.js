const mongoose = require('mongoose');
const validator = require('validator');
const Transaction = require('./transactionModel');
const GiftCard = require('./giftCardModel');
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

itemSchema.statics.createTransaction = async function (id) {
  console.log('hello');
  // const { tax, usShippingFee, quantity, pricePerItem } = this;

  // const totalCost =
  //   pricePerItem * quantity * (1 + parseFloat(tax)) + usShippingFee;

  // console.log(totalCost);

  // let transaction = await Transaction.findOne({ itemID: this.id });

  // if (transaction) {
  //   transaction = await Transaction.findByIdAndUpdate(transaction.id, {
  //     transactionType: 'outflow',
  //     amount: totalCost,
  //     accountID: this.orderAccount,
  //     itemID: this.id,
  //   });
  // } else {
  //   transaction = await Transaction.create({
  //     transactionType: 'outflow',
  //     amount: totalCost,
  //     accountID: this.orderAccount,
  //     itemID: this.id,
  //   });
  // }

  const item = await this.aggregate([
    {
      $match: { _id: mongoose.Types.ObjectId(id) },
    },
    {
      $project: {
        orderAccount: 1,
        total: {
          // $add: ['$tax', '$usShippingFee', '$quantity', '$pricePerItem'],
          $add: [
            '$usShippingFee',
            {
              $multiply: ['$quantity', '$pricePerItem', { $add: [1, '$tax'] }],
            },
          ],
        },
      },
    },
  ]);

  const transaction = await Transaction.findOneAndUpdate(
    { itemID: id },
    {
      transactionType: 'outflow',
      amount: parseFloat(item[0].total),
      accountID: item[0].orderAccount,
      itemID: item[0]._id,
    },
    { upsert: true, returnNewDocument: true, returnOriginal: false }
  );

  console.log(parseFloat(item[0].total));

  const giftcards = await GiftCard.aggregate([
    {
      $match: {
        remainingBalance: { $gt: 0 },
      },
    },
    {
      $sort: {
        timeBuy: 1,
      },
    },
    {
      $project: {
        partialBalance: 1,
        remainingBalance: 1,
      },
    },
  ]);
  console.log(giftcards);
  console.log(giftcards[0].partialBalance[0]);

  let remaining = parseFloat(item[0].total);
  let actualCost = 0;
  let index = 0;

  while (
    remaining > parseFloat(giftcards[index].remainingBalance) &&
    index < giftcards.length
  ) {
    let j = 0;
    while (
      remaining >
        parseFloat(giftcards[index].partialBalance[j].remainingBalance) &&
      j < giftcards[index].partialBalance.length
    ) {
      actualCost +=
        parseFloat(giftcards[index].partialBalance[j].remainingBalance) *
        parseFloat(giftcards[index].partialBalance[j].actualCostRate);
      remaining -= giftcards[index].partialBalance[j].remainingBalance;
      j++;
    }
    index++;
  }
  let j = 0;
  while (
    remaining >
      parseFloat(giftcards[index].partialBalance[j].remainingBalance) &&
    j < giftcards[index].partialBalance.length
  ) {
    actualCost =
      Math.round(
        (parseFloat(giftcards[index].partialBalance[j].remainingBalance) *
          100000000 *
          (parseFloat(giftcards[index].partialBalance[j].actualCostRate) *
            100000000)) /
          100000000 +
          actualCost * 100000000
      ) / 100000000;
    console.log(actualCost);
    remaining =
      Math.round(
        remaining * 100000000 -
          giftcards[index].partialBalance[j].remainingBalance * 100000000
      ) / 100000000;
    j++;
  }

  actualCost =
    Math.round(
      (remaining *
        100000000 *
        (parseFloat(giftcards[index].partialBalance[j].actualCostRate) *
          100000000)) /
        100000000 +
        actualCost * 100000000
    ) / 100000000;

  console.log(actualCost);

  // const current = await GiftCard.aggregate([
  //   {
  //     $project: {
  //       first: { $arrayElemAt: ['$partialBalance', 0] },
  //     },
  //   },
  //   {
  //     $project: {
  //       total: {
  //         $multiply: ['$first.actualCostRate', '$first.remainingBalance'],
  //       },
  //     },
  //   },
  // ]);
  // console.log('//////////////////////////////////////////////////////');
  // console.log(parseFloat(current[0].total));
  // console.log('//////////////////////////////////////////////////////');

  return transaction;
};

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
