const mongoose = require('mongoose');
const Transaction = require('./transactionModel');
const GiftCard = require('./giftCardModel');
const AppError = require('../utils/appError');
const Account = require('./accountModel');

const itemSchema = mongoose.Schema(
  {
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
      type: mongoose.Decimal128,
      required: [true, 'An Item must have a price'],
      min: [0, 'Price cannot be negative'],
    },
    tax: {
      type: mongoose.Decimal128,
      default: 0.0,
      min: [0, 'Tax must not be negative'],
      max: [1, 'Tax cannot be larger then 100%'],
    },
    usShippingFee: {
      type: mongoose.Decimal128,
      default: 0.0,
      min: [0, 'Shipping Fee cannot be negative'],
    },
    estimatedWeight: {
      type: mongoose.Decimal128,
      default: 0.0,
      min: [0, 'Weight cannot be negative'],
    },
    actualWeight: {
      type: mongoose.Decimal128,
      default: 0.0,
      min: [0, 'Weight cannot be negative'],
    },

    // actual gc cost, exclude shipping to VN fee
    // update only after charge
    actualCost: {
      type: mongoose.Decimal128,
      default: 0.0,
    },
    quantity: {
      type: Number,
      default: 1,
    },
    trackingLink: String,
    orderedWebsite: {
      type: String,
      enum: [
        'amazon',
        'ebay',
        'sephora',
        'bestbuy',
        'costco',
        'walmart',
        'others',
      ],
      default: 'amazon',
    },
    invoiceLink: String,
    orderAccount: {
      type: mongoose.Schema.ObjectId,
      ref: 'Account',
    },
    createdAt: {
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
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

itemSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'orderAccount',
    select: 'balance loginID',
  });

  next();
});

itemSchema.statics.createTransaction = async function (id) {
  // query and calculate total gift card cost
  // get account balance

  console.log(id);
  const item = await this.aggregate([
    {
      $match: { _id: mongoose.Types.ObjectId(id) },
    },

    {
      $project: {
        orderAccount: 1,
        actualCost: 1,
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
    {
      $unwind: '$orderAccountInfo',
    },
    {
      $project: {
        _id: 1,
        total: 1,
        'orderAccountInfo.balance': 1,
        'orderAccountInfo._id': 1,
      },
    },
  ]);

  // throw error if account not have enough balance to charge
  if (item[0].total > item[0].orderAccountInfo.balance) {
    return new AppError('Not enough balance in account', 400);
  }

  // get giftcard partial balance and rate
  // filter giftcard partial balance that is === 0
  const giftcards = await GiftCard.aggregate([
    {
      $match: {
        remainingBalance: { $gt: 0 },
      },
    },
    {
      $sort: {
        createdAt: 1,
      },
    },
    {
      $project: {
        // partialBalance: 1,
        remainingBalance: 1,
        partialBalance: 1,
        // {
        //   $filter: {
        //     input: '$partialBalance',
        //     as: 'balance',
        //     cond: { $gt: ['$$balance.remainingBalance', 0] },
        //   },
        // },
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

  // charge full amount of gift card partial balance
  while (
    index < giftcards.length &&
    remaining > parseFloat(giftcards[index].remainingBalance)
  ) {
    let j = 0;
    let currentPartial = giftcards[index].partialBalance[j];
    while (
      j < giftcards[index].partialBalance.length &&
      remaining > parseFloat(currentPartial.remainingBalance)
    ) {
      actualCost =
        Math.round(
          actualCost * 100000000 +
            Math.round(
              parseFloat(currentPartial.remainingBalance) *
                100000000 *
                parseFloat(currentPartial.actualCostRate) *
                100000000
            ) /
              100000000
        ) / 100000000;
      remaining =
        Math.round(
          remaining * 100000000 - currentPartial.remainingBalance * 100000000
        ) / 100000000;
      currentPartial.remainingBalance = 0;

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
      j += 1;
      currentPartial = giftcards[index].partialBalance[j];
    }
    giftCardPromises.push(
      GiftCard.updateOne(
        {
          _id: giftcards[index]._id,
        },
        {
          $set: {
            remainingBalance: 0,
          },
        }
      )
    );
    index += 1;
  }

  if (index >= giftcards.length) {
    return new AppError('not enough balance', 400);
  }

  // charge the last gift card
  let j = 0;

  let currentPartial = giftcards[index].partialBalance[j];
  while (
    j < giftcards[index].partialBalance.length &&
    remaining > parseFloat(currentPartial.remainingBalance)
  ) {
    actualCost =
      Math.round(
        actualCost * 100000000 +
          Math.round(
            parseFloat(currentPartial.remainingBalance) *
              100000000 *
              parseFloat(currentPartial.actualCostRate) *
              100000000
          ) /
            100000000
      ) / 100000000;
    remaining =
      Math.round(
        remaining * 100000000 - currentPartial.remainingBalance * 100000000
      ) / 100000000;

    giftcards[index].remainingBalance =
      Math.round(
        giftcards[index].remainingBalance * 100000000 -
          currentPartial.remainingBalance * 100000000
      ) / 100000000;
    currentPartial.remainingBalance = 0;

    giftCardPromises.push(
      GiftCard.updateOne(
        {
          _id: giftcards[index]._id,
          // partialBalance: {
          //   remainingBalance: { $gt: 0 },
          // },
        },
        {
          $set: {
            [`partialBalance.${j}.remainingBalance`]: 0,
          },
        }
      )
    );

    j += 1;
    currentPartial = giftcards[index].partialBalance[j];
  }

  // if no partial left to charge money
  if (
    index >= giftcards.length ||
    j >= giftcards[index].partialBalance.length ||
    remaining > parseFloat(giftcards[index].partialBalance[j].remainingBalance)
  ) {
    return new AppError('not enough balance', 400);
  }

  // Last partial balance of a last gift card
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

  giftcards[index].remainingBalance =
    Math.round(
      giftcards[index].remainingBalance * 100000000 - remaining * 100000000
    ) / 100000000;

  // update last partial of last gift card
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

  // update actual cost & status for the current item
  giftCardPromises.push(
    this.updateOne(
      {
        _id: mongoose.Types.ObjectId(id),
      },
      {
        $set: {
          actualCost,
          status: 'ordered',
        },
      }
    )
  );

  giftCardPromises.push(
    GiftCard.updateOne(
      {
        _id: giftcards[index]._id,
      },
      {
        $set: {
          remainingBalance: giftcards[index].remainingBalance,
        },
      }
    )
  );

  // update account balance
  giftCardPromises.push(
    Account.updateOne(
      {
        _id: item[0].orderAccountInfo._id,
      },
      {
        $set: {
          balance:
            Math.round(
              parseFloat(item[0].orderAccountInfo.balance) * 100000000 -
                parseFloat(item[0].total) * 100000000
            ) / 100000000,
        },
      }
    )
  );

  // create a new outflow transaction TODO

  const transaction = await Transaction.findOneAndUpdate(
    { itemID: id },
    {
      transactionType: 'outflow',
      amount: actualCost,
      accountID: item[0].orderAccountInfo._id,
      itemID: item[0]._id,
      gcCost: parseFloat(item[0].total),
    },
    { upsert: true, returnNewDocument: true, returnOriginal: false }
  );

  await Promise.all(giftCardPromises);

  return transaction;
};

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
