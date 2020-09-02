const mongoose = require('mongoose');
const Transaction = require('./transactionModel');
const GiftCard = require('./giftCardModel');
const AppError = require('../utils/appError');
const Account = require('./accountModel');
const Bill = require('./billModel');
const getNextSequence = require('../utils/getNextSequence');
const catchAsync = require('../utils/catchAsync');

const MUL = 100000000;

const itemSchema = mongoose.Schema(
  {
    link: {
      type: String,
      required: [true, 'An Item must have a link'],
    },
    name: {
      type: String,
      required: [true, 'An Item must have a name'],
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
        'no-return-refunded',
        'return-refunded',
        'lost',
        'in-inventory',
      ],
      default: 'not-yet-ordered',
    },
    pricePerItem: {
      type: mongoose.Decimal128,
      required: [true, 'An Item must have a price'],
      min: [0, 'Price cannot be negative'],
    },
    actualPricePerItem: mongoose.Decimal128,
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
    estimatedWeightPerItem: {
      type: mongoose.Decimal128,
      default: 0.0,
      min: [0, 'Weight cannot be negative'],
    },
    actualWeightPerItem: {
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
    // partialBalance: [
    //   {
    //     actualCostRate: mongoose.Decimal128,
    //     remainingBalance: mongoose.Decimal128,
    //   },
    // ],
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
        'assisting',
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
    orderDate: Date,
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
    returnPkgDate: Date,
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
    customId: {
      type: String,
      unique: true,
    },
    fromAcctBalance: mongoose.Decimal128,
    warehouse: {
      type: String,
      required: [true, 'An item must have a warehouse to be delivered to'],
      enum: ['unihan', 'unisgn', 'pacific', 'others'],
    },
    bill: {
      type: mongoose.Schema.ObjectId,
      ref: 'Bill',
    },
    chargeable: {
      type: Boolean,
      default: true,
    },
    commissionRateForAffiliate: mongoose.Decimal128,
    shippingExtraBase: {
      unit: {
        type: String,
        enum: ['usd', 'vnd', '%'],
        default: 'usd',
      },
      value: {
        type: Number,
        default: 0,
      },
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

itemSchema.pre('save', function (next) {
  this.actualPricePerItem = this.pricePerItem;

  next();
});

itemSchema.pre('save', async function (next) {
  const res = await getNextSequence('item');
  this.customId = `ITEM-${res}`;

  next();
});

itemSchema.statics.calcBill = async function (doc) {
  try {
    const bill = await Bill.findById(doc.bill).select(
      'customer taxForCustomer shippingRateToVn usdVndRate moneyReceived -items'
    );

    if (!bill) {
      return new AppError('Bill not found', 400);
    }

    const items = await this.aggregate([
      {
        $match: {
          bill: doc.bill,
          chargeable: true,
        },
      },
    ]);

    console.log(items);

    let totalBillCost = 0;
    let moneyChargeCustomerUSD = 0;
    let totalEstimatedWeight = 0;
    let totalShippingExtra = 0;
    // let commissionForAffiliate = 0;
    const {
      customer,
      taxForCustomer,
      shippingRateToVn,
      usdVndRate,

      // affiliate,
    } = bill;

    items.forEach((item) => {
      let {
        usShippingFee,
        pricePerItem,
        quantity,
        orderedWebsite,
        estimatedWeightPerItem,
        shippingExtraBase,
      } = item;

      usShippingFee = parseFloat(usShippingFee);
      pricePerItem = parseFloat(pricePerItem);
      quantity = parseFloat(quantity);
      estimatedWeightPerItem = parseFloat(estimatedWeightPerItem);

      console.log('Shipping Extra ', shippingExtraBase);

      // TODO: test calc shipping Extra Fee
      if (shippingExtraBase.unit === 'usd') {
        totalShippingExtra += shippingExtraBase.value * quantity;
      } else if (shippingExtraBase.unit === 'vnd') {
        totalShippingExtra += (shippingExtraBase.value * quantity) / usdVndRate;
      } else if (shippingExtraBase.unit === '%') {
        totalShippingExtra +=
          (pricePerItem * quantity * shippingExtraBase.value) / 100;
      }

      totalBillCost =
        Math.round(
          totalBillCost * MUL +
            parseFloat(usShippingFee) * MUL +
            MUL *
              parseFloat(pricePerItem) *
              parseFloat(quantity) *
              (1 + parseFloat(taxForCustomer))
        ) / MUL;

      moneyChargeCustomerUSD =
        Math.round(
          moneyChargeCustomerUSD * MUL +
            usShippingFee * MUL +
            MUL *
              pricePerItem *
              quantity *
              (1 - customer.discountRate[orderedWebsite]) +
            MUL *
              parseFloat(taxForCustomer) *
              (usShippingFee + pricePerItem * quantity)
        ) / MUL;

      totalEstimatedWeight =
        Math.round(
          totalEstimatedWeight * MUL + estimatedWeightPerItem * quantity * MUL
        ) / MUL;

      // if (item.commissionRateForAffiliate === undefined) {
      //   commissionForAffiliate +=
      //     affiliate.commissionRate[orderedWebsite] *
      //     (pricePerItem * quantity + usShippingFee);
      // } else {
      //   commissionForAffiliate +=
      //     item.commissionForAffiliate *
      //     (pricePerItem * quantity + usShippingFee);
      // }
    });

    // calculate shippingFeeToVnInUSD
    let shippingFeeToVnInUSD;

    if (shippingRateToVn.currency === 'usd') {
      shippingFeeToVnInUSD =
        Math.round(
          parseFloat(totalEstimatedWeight) *
            100 *
            10 *
            parseFloat(shippingRateToVn.value)
        ) / 1000;
    } else {
      shippingFeeToVnInUSD =
        Math.round(
          (parseFloat(totalEstimatedWeight) *
            100 *
            10 *
            parseFloat(shippingRateToVn.value)) /
            parseFloat(usdVndRate)
        ) / 1000;
    }

    // calculate totalBillCost after ship
    totalBillCost =
      Math.round(
        totalBillCost * MUL +
          shippingFeeToVnInUSD * MUL +
          totalShippingExtra * MUL
      ) / MUL;

    console.log(totalBillCost, 'total bill cost');

    // calculate moneyChargeCustomer after ship
    moneyChargeCustomerUSD =
      Math.round(
        moneyChargeCustomerUSD * MUL +
          shippingFeeToVnInUSD * MUL +
          totalShippingExtra * MUL
      ) / MUL;

    // commissionForAffiliate *= usdVndRate;

    await Bill.findByIdAndUpdate(doc.bill, {
      estimatedWeight: totalEstimatedWeight,
      remaining:
        Math.round(
          parseFloat(bill.usdVndRate) * MUL * moneyChargeCustomerUSD -
            parseFloat(bill.moneyReceived) * MUL
        ) / MUL,
      actualBillCost: totalBillCost,
      moneyChargeCustomerUSD: moneyChargeCustomerUSD,
      actualChargeCustomer:
        Math.round(parseFloat(bill.usdVndRate) * MUL * moneyChargeCustomerUSD) /
        MUL,
      // commissionForAffiliate: commissionForAffiliate,
    });
  } catch (err) {
    console.log(err);
  }
};

// findOneAndUpdate
// findOneAndDelete
itemSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.findOne();

  next();
});

itemSchema.post(/^findOneAnd/, async function () {
  await this.r.constructor.calcBill(this.r);
});

itemSchema.post('save', function (doc) {
  if (doc.bill) {
    this.constructor.calcBill(doc);
  }
});

itemSchema.statics.createTransaction = async function (id, accountId) {
  // query and calculate total gift card cost
  // get account balance

  console.log(id);
  const item = await this.aggregate([
    {
      $match: { _id: mongoose.Types.ObjectId(id) },
    },

    {
      $project: {
        _id: 1,
        status: 1,
        orderedWebsite: 1,
        // actualCost: 1,
        total: {
          // $add: ['$tax', '$usShippingFee', '$quantity', '$pricePerItem'],
          $add: [
            '$usShippingFee',
            {
              $multiply: [
                '$quantity',
                '$actualPricePerItem',
                { $add: [1, '$tax'] },
              ],
            },
          ],
        },
      },
    },
    // {
    //   $lookup: {
    //     from: 'accounts',
    //     localField: 'orderAccount',
    //     foreignField: '_id',
    //     as: 'orderAccountInfo',
    //   },
    // },

    // destructure orderAccountInfo since it will be an array
    // {
    //   $unwind: '$orderAccountInfo',
    // },
    // {
    //   $project: {
    //     _id: 1,
    //     total: 1,
    //     // 'orderAccountInfo.balance': 1,
    //     'orderAccountInfo._id': 1,
    //     'orderAccountInfo.accountWebsite': 1,
    //     status: 1,
    //     orderedWebsite: 1,
    //   },
    // },
  ]);

  if (item.length === 0) {
    return new AppError('Item not found', 400);
  }

  // check status
  if (item[0].status !== 'not-yet-ordered') {
    return new AppError('Item already ordered', 400);
  }

  // // check orderAccount with associated account
  // if (
  //   item[0].orderedWebsite.toLowerCase() !==
  //   item[0].orderAccountInfo.accountWebsite.toLowerCase()
  // ) {
  //   return new AppError('Oops, Wrong account', 400);
  // }

  let trans;

  try {
    trans = await Transaction.create({
      fromAccount: accountId,

      amountSpent: {
        value: item[0].total * 1,
        currency: 'usd',
      },
      amountSpentFee: {
        value: 0,
        currency: 'usd',
      },
      item: id,
    });
  } catch (err) {
    return new AppError(err.message, err.statusCode);
  }

  const totalGcNeeded = parseFloat(item[0].total);

  // if (totalGcNeeded > parseFloat(item[0].orderAccountInfo.balance)) {
  //   return new AppError('not enough balance in account', 400);
  // }

  // const newAccountBal =
  //   parseFloat(item[0].orderAccountInfo.balance) - totalGcNeeded;

  // get giftcard to consume
  const giftcards = await GiftCard.aggregate([
    {
      $match: {
        remainingBalance: { $gt: 0 },
        toAccount: mongoose.Types.ObjectId(accountId),
      },
    },
    {
      $sort: {
        createdAt: 1,
        _id: 1,
      },
    },
    {
      $project: {
        remainingBalance: 1,
        partialBalance: 1,
      },
    },
  ]);

  console.log(giftcards);

  const gcLength = giftcards.length;

  // throw error if no gift cards balance > 0
  if (gcLength === 0) {
    return new AppError('Not enough balance', 400);
  }

  let remainingGcNeeded = totalGcNeeded;
  let actualCost = 0;
  let index = 0;
  let currentGcBal = parseFloat(giftcards[0].remainingBalance);
  const giftCardPromises = [];
  const partialBalance = [];

  // for giftcards that will be exhausted completely
  while (index < gcLength && remainingGcNeeded > currentGcBal) {
    let j = 0;
    let currentPartial = giftcards[index].partialBalance[j];

    while (
      j < giftcards[index].partialBalance.length &&
      remainingGcNeeded > parseFloat(currentPartial.remainingBalance)
    ) {
      const partActualCost =
        Math.round(
          parseFloat(currentPartial.remainingBalance) *
            MUL *
            MUL *
            parseFloat(currentPartial.actualCostRate)
        ) / MUL;

      actualCost = Math.round(actualCost * MUL + partActualCost) / MUL;

      remainingGcNeeded =
        Math.round(
          remainingGcNeeded * MUL - currentPartial.remainingBalance * MUL
        ) / MUL;

      // May or May not need
      // currentPartial.remainingBalance = 0;
      giftCardPromises.push(
        GiftCard.updateOne(
          { _id: giftcards[index]._id },
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
    currentGcBal = parseFloat(giftcards[index].remainingBalance);
  }

  if (index >= gcLength) {
    return new AppError('Not enough balance', 400);
  }

  // charge the last gift card
  let k = 0;
  const remainingForLastGc = remainingGcNeeded;
  let currentPartial = giftcards[index].partialBalance[k];
  while (
    k < giftcards[index].partialBalance.length &&
    remainingGcNeeded > currentPartial.remainingBalance
  ) {
    const partActualCost =
      Math.round(
        parseFloat(currentPartial.remainingBalance) *
          MUL *
          MUL *
          parseFloat(currentPartial.actualCostRate)
      ) / MUL;

    actualCost = Math.round(actualCost * MUL + partActualCost) / MUL;

    remainingGcNeeded =
      Math.round(
        remainingGcNeeded * MUL - currentPartial.remainingBalance * MUL
      ) / MUL;

    giftCardPromises.push(
      GiftCard.updateOne(
        {
          _id: giftcards[index]._id,
        },
        {
          $set: {
            [`partialBalance.${k}.remainingBalance`]: 0,
          },
        }
      )
    );

    k += 1;
    currentPartial = giftcards[index].partialBalance[k];
  }

  // if no partial left to charge money
  if (
    index >= gcLength ||
    k >= giftcards[index].partialBalance.length ||
    remainingGcNeeded >
      parseFloat(giftcards[index].partialBalance[k].remainingBalance)
  ) {
    return new AppError('not enough balance', 400);
  }

  // last partial balance
  const partActualCost =
    Math.round(
      parseFloat(remainingGcNeeded) *
        MUL *
        MUL *
        parseFloat(currentPartial.actualCostRate)
    ) / MUL;

  actualCost = Math.round(actualCost * MUL + partActualCost) / MUL;
  const remainingPartialBalance =
    Math.round(
      parseFloat(giftcards[index].partialBalance[k].remainingBalance) * MUL -
        remainingGcNeeded * MUL
    ) / MUL;
  const lastGiftCardBalance = giftcards[index].remainingBalance;
  const lastGiftCardRemaining =
    Math.round(lastGiftCardBalance * MUL - remainingForLastGc * MUL) / MUL;

  giftCardPromises.push(
    GiftCard.updateOne(
      {
        _id: giftcards[index]._id,
      },
      {
        $set: {
          [`partialBalance.${k}.remainingBalance`]: remainingPartialBalance,
        },
      }
    )
  );

  // update remainingBalance for last giftcard
  giftCardPromises.push(
    GiftCard.updateOne(
      {
        _id: giftcards[index]._id,
      },
      {
        $set: {
          remainingBalance: lastGiftCardRemaining,
        },
      }
    )
  );

  // // update account balance
  // giftCardPromises.push(
  //   Account.findOneAndUpdate(
  //     {
  //       _id: item[0].orderAccountInfo._id,
  //     },
  //     {
  //       $inc: {
  //         balance: totalGcNeeded * -1,
  //       },
  //     }
  //   )
  // );

  // const transaction = await Transaction.findOneAndUpdate(
  //   { itemID: id },
  //   {
  //     transactionType: 'outflow',
  //     amount: totalGcNeeded,
  //     account: item[0].orderAccountInfo._id,
  //     item: item[0]._id,
  //     actualCost,
  //     createdAt: Date.now(),
  //     balance: newAccountBal,
  //     currency: 'usd',
  //   },
  //   { upsert: true, returnNewDocument: true, returnOriginal: false }
  // );

  await Promise.all(giftCardPromises);

  // update status to ordered & actualCost
  const newItem = await this.findOneAndUpdate(
    {
      _id: mongoose.Types.ObjectId(id),
    },
    {
      $set: {
        actualCost,
        status: 'ordered',
        fromAcctBalance: trans.fromAcctBalance,
        orderDate: Date.now(),
        orderAccount: accountId,
        partialBalance: partialBalance,
      },
    },
    { returnOriginal: false }
  );
  // // throw error if account not have enough balance to charge
  // if (item[0].total > item[0].orderAccountInfo.balance) {
  //   return new AppError('Not enough balance in account', 400);
  // }

  // // get giftcard partial balance and rate
  // // filter giftcard partial balance that is === 0
  // const giftcards = await GiftCard.aggregate([
  //   {
  //     $match: {
  //       remainingBalance: { $gt: 0 },
  //     },
  //   },
  //   {
  //     $sort: {
  //       createdAt: 1,
  //     },
  //   },
  //   {
  //     $project: {
  //       // partialBalance: 1,
  //       remainingBalance: 1,
  //       partialBalance: 1,
  //       // {
  //       //   $filter: {
  //       //     input: '$partialBalance',
  //       //     as: 'balance',
  //       //     cond: { $gt: ['$$balance.remainingBalance', 0] },
  //       //   },
  //       // },
  //     },
  //   },
  // ]);

  // if (giftcards.length === 0) {
  //   return new AppError('Not enough balance', 400);
  // }

  // let remaining = parseFloat(item[0].total);
  // let actualCost = 0;
  // let index = 0;
  // const giftCardPromises = [];

  // // charge full amount of gift card partial balance
  // while (
  //   index < giftcards.length &&
  //   remaining > parseFloat(giftcards[index].remainingBalance)
  // ) {
  //   let j = 0;
  //   let currentPartial = giftcards[index].partialBalance[j];
  //   while (
  //     j < giftcards[index].partialBalance.length &&
  //     remaining > parseFloat(currentPartial.remainingBalance)
  //   ) {
  //     actualCost =
  //       Math.round(
  //         actualCost * 100000000 +
  //           Math.round(
  //             parseFloat(currentPartial.remainingBalance) *
  //               100000000 *
  //               parseFloat(currentPartial.actualCostRate) *
  //               100000000
  //           ) /
  //             100000000
  //       ) / 100000000;
  //     remaining =
  //       Math.round(
  //         remaining * 100000000 - currentPartial.remainingBalance * 100000000
  //       ) / 100000000;
  //     currentPartial.remainingBalance = 0;

  //     giftCardPromises.push(
  //       GiftCard.updateOne(
  //         {
  //           _id: giftcards[index]._id,
  //         },
  //         {
  //           $set: {
  //             [`partialBalance.${j}.remainingBalance`]: 0,
  //           },
  //         }
  //       )
  //     );
  //     j += 1;
  //     currentPartial = giftcards[index].partialBalance[j];
  //   }
  //   giftCardPromises.push(
  //     GiftCard.updateOne(
  //       {
  //         _id: giftcards[index]._id,
  //       },
  //       {
  //         $set: {
  //           remainingBalance: 0,
  //         },
  //       }
  //     )
  //   );
  //   index += 1;
  // }

  // if (index >= giftcards.length) {
  //   return new AppError('not enough balance', 400);
  // }

  // // charge the last gift card
  // let j = 0;

  // let currentPartial = giftcards[index].partialBalance[j];
  // while (
  //   j < giftcards[index].partialBalance.length &&
  //   remaining > parseFloat(currentPartial.remainingBalance)
  // ) {
  //   actualCost =
  //     Math.round(
  //       actualCost * 100000000 +
  //         Math.round(
  //           parseFloat(currentPartial.remainingBalance) *
  //             100000000 *
  //             parseFloat(currentPartial.actualCostRate) *
  //             100000000
  //         ) /
  //           100000000
  //     ) / 100000000;
  //   remaining =
  //     Math.round(
  //       remaining * 100000000 - currentPartial.remainingBalance * 100000000
  //     ) / 100000000;

  //   giftcards[index].remainingBalance =
  //     Math.round(
  //       giftcards[index].remainingBalance * 100000000 -
  //         currentPartial.remainingBalance * 100000000
  //     ) / 100000000;
  //   currentPartial.remainingBalance = 0;

  //   giftCardPromises.push(
  //     GiftCard.updateOne(
  //       {
  //         _id: giftcards[index]._id,
  //         // partialBalance: {
  //         //   remainingBalance: { $gt: 0 },
  //         // },
  //       },
  //       {
  //         $set: {
  //           [`partialBalance.${j}.remainingBalance`]: 0,
  //         },
  //       }
  //     )
  //   );

  //   j += 1;
  //   currentPartial = giftcards[index].partialBalance[j];
  // }

  // // if no partial left to charge money
  // if (
  //   index >= giftcards.length ||
  //   j >= giftcards[index].partialBalance.length ||
  //   remaining > parseFloat(giftcards[index].partialBalance[j].remainingBalance)
  // ) {
  //   return new AppError('not enough balance', 400);
  // }

  // // Last partial balance of a last gift card
  // actualCost =
  //   Math.round(
  //     (remaining *
  //       100000000 *
  //       (parseFloat(giftcards[index].partialBalance[j].actualCostRate) *
  //         100000000)) /
  //       100000000 +
  //       actualCost * 100000000
  //   ) / 100000000;

  // // calculate the remaining partial Balance, save into gift card
  // const remainingPartialBalance =
  //   Math.round(
  //     parseFloat(giftcards[index].partialBalance[j].remainingBalance) *
  //       100000000 -
  //       remaining * 100000000
  //   ) / 100000000;

  // giftcards[index].remainingBalance =
  //   Math.round(
  //     giftcards[index].remainingBalance * 100000000 - remaining * 100000000
  //   ) / 100000000;

  // // update last partial of last gift card
  // giftcards[index].partialBalance[j].remainingBalance = remainingPartialBalance;

  // giftCardPromises.push(
  //   GiftCard.updateOne(
  //     {
  //       _id: giftcards[index]._id,
  //     },
  //     {
  //       $set: {
  //         [`partialBalance.${j}.remainingBalance`]: remainingPartialBalance,
  //       },
  //     }
  //   )
  // );

  // // update actual cost & status for the current item
  // giftCardPromises.push(
  //   this.updateOne(
  //     {
  //       _id: mongoose.Types.ObjectId(id),
  //     },
  //     {
  //       $set: {
  //         actualCost,
  //         status: 'ordered',
  //       },
  //     }
  //   )
  // );

  // giftCardPromises.push(
  //   GiftCard.updateOne(
  //     {
  //       _id: giftcards[index]._id,
  //     },
  //     {
  //       $set: {
  //         remainingBalance: giftcards[index].remainingBalance,
  //       },
  //     }
  //   )
  // );

  // // update account balance
  // giftCardPromises.push(
  //   Account.updateOne(
  //     {
  //       _id: item[0].orderAccountInfo._id,
  //     },
  //     {
  //       $set: {
  //         balance:
  //           Math.round(
  //             parseFloat(item[0].orderAccountInfo.balance) * 100000000 -
  //               parseFloat(item[0].total) * 100000000
  //           ) / 100000000,
  //       },
  //     }
  //   )
  // );

  // // create a new outflow transaction TODO

  // const transaction = await Transaction.findOneAndUpdate(
  //   { itemID: id },
  //   {
  //     transactionType: 'outflow',
  //     amount: actualCost,
  //     accountID: item[0].orderAccountInfo._id,
  //     itemID: item[0]._id,
  //     gcCost: parseFloat(item[0].total),
  //   },
  //   { upsert: true, returnNewDocument: true, returnOriginal: false }
  // );

  // await Promise.all(giftCardPromises);

  return newItem;
};

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
