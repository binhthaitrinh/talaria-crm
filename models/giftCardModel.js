const mongoose = require('mongoose');
const Paxful = require('./paxfulModel');
const Transaction = require('./transactionModel');
const AppError = require('../utils/appError');
const Account = require('./accountModel');

const giftCardSchema = mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  priceInBtc: {
    type: mongoose.Decimal128,
    required: [true, 'Gift card deposit must have a price in BTC'],
  },
  feeBtc: {
    type: mongoose.Decimal128,
    default: 0.0,
  },
  giftCardValue: {
    type: Number,
    required: [true, 'Gift card deposit must have value'],
  },
  giftCardType: {
    type: String,
    enum: ['amazon', 'sephora', 'ebay', 'bestbuy', 'costco', 'others'],
    required: [true, 'Gift card deposit must have a type'],
  },
  discountRate: mongoose.Decimal128,
  remainingBalance: mongoose.Decimal128,
  partialBalance: [
    {
      actualCostRate: mongoose.Decimal128,
      remainingBalance: mongoose.Decimal128,
    },
  ],
  account: {
    type: mongoose.Schema.ObjectId,
    ref: 'Account',
    required: [true, 'Gift card deposit must have an account ID'],
  },
  btcUsdRate: {
    type: mongoose.Decimal128,
    default: 9500,
  },
  usdVndRate: {
    type: mongoose.Decimal128,
    default: 23700,
  },
  hardCardPic: String,
  receiptPic: String,
  notes: String,
});

giftCardSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'account',
    select: 'balance loginID',
  });

  next();
});

giftCardSchema.pre('save', function (next) {
  this.remainingBalance = this.giftCardValue;

  next();
});

giftCardSchema.pre('save', async function (next) {
  // const query = Paxful.find({ remainingBalance: { $ne: 0 } }).sort({ date: 1 });

  // Query paxful documents that have remaining > 0, sorted by date
  const paxfuls = await Paxful.aggregate([
    {
      $match: {
        'remainingBalance.amount': {
          $gt: 0,
        },
        transactionType: 'inflow',
      },
    },
    {
      $sort: {
        createdAt: 1,
      },
    },
    {
      $project: {
        remainingBalance: 1,
        // moneySpent: 1,
      },
    },
  ]);

  if (paxfuls.length === 0) {
    return next(new AppError('not enough BTC', 400));
  }

  let remainingBtcNeeded =
    Math.round(
      parseFloat(this.priceInBtc) * 100000000 +
        parseFloat(this.feeBtc) * 100000000
    ) / 100000000;
  let remainingGc = parseFloat(this.giftCardValue);
  const totalBtcNeeded = remainingBtcNeeded;
  const rates = [];
  let index = 0;

  // Keep taking BTC from paxful transaction
  while (
    index < paxfuls.length &&
    remainingBtcNeeded > parseFloat(paxfuls[index].remainingBalance.amount)
  ) {
    const paxful = paxfuls[index];
    const vndBtcRate = parseFloat(paxful.remainingBalance.rating);
    const remainingBtcInPaxful = parseFloat(paxful.remainingBalance.amount);
    const vndGcRate =
      Math.round(
        (vndBtcRate * 100000000 * totalBtcNeeded) /
          parseFloat(this.giftCardValue)
      ) / 100000000;
    const giftCardBalance =
      Math.round(
        ((remainingBtcInPaxful * parseFloat(this.giftCardValue) * 100000000) /
          (totalBtcNeeded * 100000000)) *
          100000000
      ) / 100000000;
    const partialRate = {
      actualCostRate: vndGcRate,
      remainingBalance: giftCardBalance,
    };
    remainingGc -= giftCardBalance;
    rates.push(partialRate);

    remainingBtcNeeded =
      (remainingBtcNeeded * 100000000 - remainingBtcInPaxful * 100000000) /
      100000000;
    paxfuls[index] = Paxful.updateOne(
      { _id: paxful._id },
      {
        $set: {
          'remainingBalance.amount': 0,
        },
      }
    );
    index += 1;
  }

  if (index >= paxfuls.length) {
    return next(new AppError('not enought BTC', 400));
  }

  // last paxful transaction to be consumed
  const paxful = paxfuls[index];
  const vndBtcRate = parseFloat(paxful.remainingBalance.rating);
  const vndGcRate =
    Math.round(
      ((vndBtcRate * remainingBtcNeeded * 10000000000000000) /
        (remainingGc * 10000000000000000)) *
        100000000
    ) / 100000000;
  const parialRate = {
    actualCostRate: vndGcRate,
    remainingBalance: remainingGc,
  };

  rates.push(parialRate);

  const remainingBtcInPaxful =
    Math.round(
      parseFloat(paxful.remainingBalance.amount) * 100000000 -
        remainingBtcNeeded * 100000000
    ) / 100000000;

  paxfuls[index] = Paxful.updateOne(
    { _id: paxful._id },
    {
      $set: {
        'remainingBalance.amount': remainingBtcInPaxful,
      },
    }
  );

  // create partiBalance for current gift card
  this.partialBalance = rates;

  const currentAccount = await Account.findById(this.account);

  if (!currentAccount) return next(new AppError('Account not found', 400));
  const newBalance =
    Math.round(
      parseFloat(currentAccount.balance) * 100000000 +
        this.giftCardValue * 100000000
    ) / 100000000;
  currentAccount.balance = newBalance;

  await Paxful.create({
    btcAmount:
      Math.round(this.priceInBtc * 100000000 + this.feeBtc * 100000000) /
      100000000,
    transactionType: 'outflow',
  });

  await Transaction.create({
    transactionType: 'inflow',
    amount: this.giftCardValue,
    accountID: this.account,
  });

  await currentAccount.save();
  await Promise.all(paxfuls);

  // let remaining = parseFloat(this.priceInBtc);
  // const total = parseFloat(this.priceInBtc);
  // let index = 0;
  // let paxful;

  // const rates = [];

  // // const paxfuls = await query;

  // while (remaining > parseFloat(paxfuls[index].remainingBalance)) {
  //   paxful = paxfuls[index];
  //   const balance = parseFloat(paxful.remainingBalance);
  //   const moneySpent = parseFloat(paxful.moneySpent.amount);
  //   // const bitcoinSpent = parseFloat(paxful.btcAmount);
  //   const rate =
  //     Math.round(
  //       (moneySpent * total * 100000000) /
  //         (balance * parseFloat(this.giftCardValue))
  //     ) / 100000000;

  //   const partial = {
  //     rate,
  //     balance,
  //   };
  //   rates.push(partial);
  //   remaining = (remaining * 100000000 - balance * 100000000) / 100000000;
  //   paxfuls[index] = Paxful.update(
  //     { _id: paxful._id },
  //     {
  //       $set: {
  //         remainingBalance: 0,
  //       },
  //     }
  //   );
  //   // paxful.remainingBalance = 0;
  //   // await paxful.save();
  //   index++;
  // }
  // paxful = paxfuls[index];
  // const balance = parseFloat(paxful.remainingBalance);
  // const moneySpent = parseFloat(paxful.moneySpent.amount);
  // // const bitcoinSpent = parseFloat(paxful.btcAmount);
  // // // const rate = (cost * total) / (bitcoinSpent * parseFloat(this.giftCardValue));
  // const rate =
  //   Math.round(
  //     (moneySpent * total * 100000000) /
  //       (balance * parseFloat(this.giftCardValue))
  //   ) / 100000000;
  // const partial = {
  //   rate,
  //   balance,
  // };
  // rates.push(partial);

  // // remaining for paxful
  // remaining = (balance * 100000000 - remaining * 100000000) / 100000000;
  // paxfuls[index] = Paxful.update(
  //   { _id: paxful._id },
  //   {
  //     $set: {
  //       remainingBalance: remaining,
  //     },
  //   }
  // );

  // await Promise.all(paxfuls);

  /////////////////*************** */

  // paxful.remainingBalance = remaining;
  // await paxful.save();
  // while (remaining > new Decimal(parseFloat(paxfuls[index].remainingBalance))) {
  //   paxful = paxfuls[index];
  //   let balance = new Decimal(parseFloat(paxful.remainingBalance));
  //   let cost = new Decimal(parseFloat(paxful.moneySpent.amount));
  //   let bitcoinSpent = new Decimal(parseFloat(paxful.btcAmount));
  //   // let rate = (cost * total) / (bitcoinSpent * parseFloat(this.giftCardValue));
  //   let rate = cost
  //     .times(total)
  //     .dividedBy(bitcoinSpent)
  //     .dividedBy(new Decimal(parseFloat(this.giftCardValue)));
  //   let partial = {
  //     rate,
  //     balance,
  //   };
  //   rates.push(partial);
  //   remaining -= balance;
  //   index++;
  // }
  // paxful = paxfuls[index];
  // let balance = new Decimal(parseFloat(paxful.remainingBalance));
  // let cost = new Decimal(parseFloat(paxful.moneySpent.amount));
  // let bitcoinSpent = new Decimal(parseFloat(paxful.btcAmount));
  // // let rate = (cost * total) / (bitcoinSpent * parseFloat(this.giftCardValue));
  // let rate = cost
  //   .times(total)
  //   .dividedBy(bitcoinSpent)
  //   .dividedBy(new Decimal(parseFloat(this.giftCardValue)));
  // let partial = {
  //   rate,
  //   balance,
  // };
  // rates.push(partial);
  // remaining -= balance;

  // console.log(paxful);
  // console.log(parseFloat(remaining));
  // console.log(rates);

  next();
});

const giftCardModel = mongoose.model('GiftCard', giftCardSchema);

module.exports = giftCardModel;
