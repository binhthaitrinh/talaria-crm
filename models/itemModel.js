const mongoose = require('mongoose');
const validator = require('validator');
const Transaction = require('./transactionModel');
const GiftCard = require('./giftCardModel');
const AppError = require('../utils/appError');
const Account = require('./accountModel');

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
  actualCost: {
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

itemSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'orderAccount',
    select: 'balance',
  });

  next();
});

itemSchema.statics.createTransaction = async function (id) {
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
    {
      $lookup: {
        from: 'accounts',
        localField: 'orderAccount',
        foreignField: '_id',
        as: 'orderAccountInfo',
      },
    },
  ]);

  if (item[0].total > item[0].orderAccountInfo[0].balance) {
    return new AppError('Not enought balance in account', 400);
  }

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

  const acctRemaining =
    Math.round(
      item[0].orderAccountInfo[0].balance * 100000000 -
        item[0].total * 100000000
    ) / 100000000;

  await Account.updateOne(
    {
      _id: item[0].orderAccount,
    },
    {
      $set: {
        balance: acctRemaining,
      },
    }
  );

  // get gift cards remaining partial balance && rate,
  // sort by date
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

  if (giftcards.length === 0) {
    return new AppError('Not enough balance', 400);
  }

  let remaining = parseFloat(item[0].total);
  let actualCost = 0;
  let index = 0;
  const giftCardPromises = [];

  // charge full amount of gift card
  while (
    index < giftcards.length &&
    remaining > parseFloat(giftcards[index].remainingBalance)
  ) {
    let j = 0;
    while (
      j < giftcards[index].partialBalance.length &&
      remaining >
        parseFloat(giftcards[index].partialBalance[j].remainingBalance)
    ) {
      actualCost +=
        parseFloat(giftcards[index].partialBalance[j].remainingBalance) *
        parseFloat(giftcards[index].partialBalance[j].actualCostRate);
      remaining -= giftcards[index].partialBalance[j].remainingBalance;
      giftcards[index].partialBalance[j].remainingBalance = 0;

      giftCardPromises.push(
        GiftCard.updateOne(
          {
            _id: giftcards[index]._id,
          },
          {
            $set: {
              [`partialBalance.${j}.remainingBalance`]: 0,
            },
          }
        )
      );
      j++;
    }
    index++;
  }

  if (index >= giftcards.length) {
    return new AppError('not enough balance', 400);
  }

  // if new gift card to be charged for the remaining
  let j = 0;

  while (
    j < giftcards[index].partialBalance.length &&
    parseFloat(giftcards[index].partialBalance[j].remainingBalance) === 0
  ) {
    j++;
  }
  console.log('///////////////////////////////////////');
  console.log(giftcards[index].partialBalance[j]);
  console.log('/////////////////////////////////////');
  while (
    j < giftcards[index].partialBalance.length &&
    remaining > parseFloat(giftcards[index].partialBalance[j].remainingBalance)
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
    giftcards[index].partialBalance[j].remainingBalance = 0;

    giftCardPromises.push(
      GiftCard.updateOne(
        {
          _id: giftcards[index]._id,
        },
        {
          $set: {
            [`partialBalance.${j}.remainingBalance`]: 0,
          },
        }
      )
    );

    j++;
  }

  if (
    index >= giftcards.length ||
    j >= giftcards[index].partialBalance.length ||
    remaining > parseFloat(giftcards[index].partialBalance[j].remainingBalance)
  ) {
    return new AppError('not enough balance', 400);
  }
  // Last partial balance of a single gift card
  actualCost =
    Math.round(
      (remaining *
        100000000 *
        (parseFloat(giftcards[index].partialBalance[j].actualCostRate) *
          100000000)) /
        100000000 +
        actualCost * 100000000
    ) / 100000000;

  // calculate the remaining partial Balance, save into gift card
  const remainingPartialBalance =
    Math.round(
      parseFloat(giftcards[index].partialBalance[j].remainingBalance) *
        100000000 -
        remaining * 100000000
    ) / 100000000;

  giftcards[index].partialBalance[j].remainingBalance = remainingPartialBalance;

  giftCardPromises.push(
    GiftCard.updateOne(
      {
        _id: giftcards[index]._id,
      },
      {
        $set: {
          [`partialBalance.${j}.remainingBalance`]: remainingPartialBalance,
        },
      }
    )
  );

  giftCardPromises.push(
    this.updateOne(
      {
        _id: mongoose.Types.ObjectId(id),
      },
      {
        $set: {
          actualCost,
        },
        $set: {
          status: 'ordered',
        },
      }
    )
  );

  let remainingGcBalance = 0;
  for (let k = 0; k < giftcards[index].partialBalance.length; k++) {
    remainingGcBalance =
      Math.round(
        remainingGcBalance * 100000000 +
          parseFloat(giftcards[index].partialBalance[k].remainingBalance) *
            100000000
      ) / 100000000;
  }

  console.log(remainingGcBalance);

  giftCardPromises.push(
    GiftCard.updateOne(
      {
        _id: giftcards[index]._id,
      },
      {
        $set: {
          remainingBalance: remainingGcBalance,
        },
      },
      {}
    )
  );

  await Promise.all(giftCardPromises);

  console.log(giftcards);

  console.log(actualCost);

  return transaction;
};

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
