const mongoose = require('mongoose');
const Paxful = require('./paxfulModel');
const Transaction = require('./transactionModel');
const AppError = require('../utils/appError');
const Account = require('./accountModel');
const btcAccountModel = require('./btcAccountModel');
const getNextSequence = require('../utils/getNextSequence');

const MUL = 100000000;

const giftCardSchema = mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  price: {
    value: {
      type: mongoose.Decimal128,
      required: [true, 'Gift card deposit must have a price'],
    },
    currency: {
      type: String,
      enum: ['vnd', 'usd', 'btc'],
      default: 'btc',
    },
    // type: mongoose.Decimal128,
    // required: [true, 'Gift card deposit must have a price in BTC'],
  },
  fee: {
    value: {
      type: mongoose.Decimal128,
      default: 0.0,
    },
    currency: {
      type: String,
      enum: ['vnd', 'usd', 'btc'],
      default: 'btc',
    },
    // type: mongoose.Decimal128,
    // default: 0.0,
  },
  giftCardValue: {
    type: Number,
    required: [true, 'Gift card deposit must have value'],
  },
  giftCardType: {
    type: String,
    enum: ['amazon', 'sephora', 'ebay', 'bestbuy', 'usd', 'others'],
    required: [true, 'Gift card deposit must have a type'],
  },
  discountRate: mongoose.Decimal128,
  remainingBalance: mongoose.Decimal128,
  fromAcctBalance: mongoose.Decimal128,
  toAcctBalance: mongoose.Decimal128,
  partialBalance: [
    {
      actualCostRate: mongoose.Decimal128,
      remainingBalance: mongoose.Decimal128,
    },
  ],
  fromAccount: {
    type: mongoose.Schema.ObjectId,
    ref: 'Account',
  },
  toAccount: {
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
  customId: {
    type: String,
    unique: true,
  },
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
  const res = await getNextSequence('giftCard');
  this.customId = `GIFTCARD-${res}`;

  next();
});

giftCardSchema.pre('save', async function (next) {
  // const query = Paxful.find({ remainingBalance: { $ne: 0 } }).sort({ date: 1 });

  // get paxful transaction that has remainingBalance > 0
  // let paxfulQuery = Paxful.find(
  //   {
  //     'remainingBalance.amount': { $gt: 0 },
  //     transactionType: 'inflow',
  //   },
  //   { remainingBalance: 1, btcAccount: 1, createdAt: 1 }
  // )
  //   .limit(10)
  //   .sort({ _id: 1 })
  //   .exec(function (err, abc) {
  //     console.log(abc);
  //   });

  // console.log(paxfulQuery);

  // paxfulQuery = paxfulQuery;

  // const paxfuls = await paxfulQuery.exec();
  // console.log(paxfuls);

  let trans;
  try {
    trans = await Transaction.create({
      fromAccount: this.fromAccount,
      toAccount: this.toAccount,
      amountSpent: {
        value: this.price.value * 1,
        currency: this.price.currency,
      },
      amountSpentFee: {
        value: this.fee.value * 1,
        currency: this.fee.currency,
      },
      amountReceived: {
        value: this.giftCardValue * 1,
        currency: 'usd',
      },
    });
  } catch (err) {
    console.log(err);
    return next();
  }

  this.fromAcctBalance = trans.fromAcctBalance;
  this.toAcctBalance = trans.toAcctBalance;

  if (this.price.currency === 'vnd') {
    const rates2 = [];
    const actualCostRate =
      Math.round(
        (this.price.value * MUL + this.fee.value * MUL) / this.giftCardValue
      ) / MUL;
    this.remainingBalance = this.giftCardValue;
    rates2.push({ actualCostRate, remainingBalance: this.giftCardValue });
    this.partialBalance = rates2;

    return next();
  }

  // find paxful transactions with remainingBalance > 0,
  // inflow type
  // sorted by createdAt ASC, _id ASC
  const paxfuls = await Paxful.aggregate([
    {
      $match: {
        'remainingBalance.amount': {
          $gt: 0,
        },
      },
    },
    {
      $sort: {
        createdAt: 1,
        _id: 1,
      },
    },
    // {
    //   $lookup: {
    //     from: 'accounts',
    //     localField: 'fromAccount',
    //     foreignField: '_id',
    //     as: 'btcAccount',
    //   },
    // },
    // {
    //   $unwind: {
    //     path: '$btcAccount',
    //   },
    // },
    {
      $project: {
        // 'btcAccount.balance': 1,
        // 'btcAccount._id': 1,
        remainingBalance: 1,
      },
    },
  ]);

  // throw exception if no transaction found
  if (paxfuls.length < 0) {
    return next(new AppError('Not enought BTC', 400));
  }

  // save btcAccount into a var
  // const { btcAccount } = paxfuls[0];
  // const btcAccountBalance = parseFloat(btcAccount.balance);

  const totalBtcNeeded =
    Math.round(this.price.value * MUL + this.fee.value * MUL) / MUL;

  // // not enought BTC for this gift card buy
  // if (btcAccountBalance < totalBtcNeeded) {
  //   return next(new AppError('Not enought BTC', 400));
  // }

  let remainingBtcNeeded = totalBtcNeeded;
  let remainingGcNeeded = parseFloat(this.giftCardValue);
  const rates = [];
  let index = 0;
  const paxfulNo = paxfuls.length;
  let curPaxfulBal = parseFloat(paxfuls[0].remainingBalance.amount);

  // for paxful transactions that will be consumed as a whole
  while (index < paxfulNo && remainingBtcNeeded > curPaxfulBal) {
    const curPaxful = paxfuls[index];
    const btcVndRate = parseFloat(curPaxful.remainingBalance.rating);
    const gcVndRate =
      Math.round(
        (btcVndRate * MUL * totalBtcNeeded) / parseFloat(this.giftCardValue)
      ) / MUL;
    const partialBalance =
      Math.round(
        (curPaxfulBal * MUL * MUL * parseFloat(this.giftCardValue)) /
          (totalBtcNeeded * MUL)
      ) / MUL;

    const partialRate = {
      actualCostRate: gcVndRate,
      remainingBalance: partialBalance,
    };
    rates.push(partialRate);

    remainingGcNeeded =
      Math.round(remainingGcNeeded * MUL - partialBalance * MUL) / MUL;

    remainingBtcNeeded =
      Math.round(remainingBtcNeeded * MUL - curPaxfulBal * MUL) / MUL;

    paxfuls[index] = Paxful.updateOne(
      { _id: curPaxful._id },
      {
        $set: {
          'remainingBalance.amount': 0,
        },
      }
    );

    // btcAccountBalance =
    //   Math.round(parseFloat(btcAccountBalance) * MUL - curPaxfulBal * MUL) /
    //   MUL;

    index += 1;

    curPaxfulBal = parseFloat(paxfuls[index].remainingBalance.amount);
  }

  if (index >= paxfulNo) {
    return next(new AppError('not enough BTC', 400));
  }

  // last paxful transaction to be consumed
  const curPaxful = paxfuls[index];
  const btcVndRate = parseFloat(curPaxful.remainingBalance.rating);
  const gcVndRate =
    Math.round(
      (btcVndRate * MUL * totalBtcNeeded) / parseFloat(this.giftCardValue)
    ) / MUL;
  const partialRate = {
    actualCostRate: gcVndRate,
    remainingBalance: remainingGcNeeded,
  };

  rates.push(partialRate);
  const remainingBtcInPaxful =
    Math.round(curPaxfulBal * MUL - remainingBtcNeeded * MUL) / MUL;

  // btcAccountBalance =
  //   Math.round(parseFloat(btcAccountBalance) * MUL - remainingBtcNeeded * MUL) /
  //   MUL;

  paxfuls[index] = Paxful.updateOne(
    { _id: curPaxful._id },
    {
      $set: {
        'remainingBalance.amount': remainingBtcInPaxful,
      },
    }
  );

  this.partialBalance = rates;

  // update account balance
  await Account.findOneAndUpdate(
    { _id: this.account },
    {
      $inc: {
        balance: this.giftCardValue * 1,
      },
    }
  );
  // const curAccount = await Account.findById(this.account);

  // const newBalance =
  //   Math.round(
  //     parseFloat(curAccount.balance) * MUL + this.giftCardValue * MUL
  //   ) / MUL;

  // curAccount.balance = newBalance;

  // await curAccount.save();

  // create a paxful transaction
  // if (this.price.currency === 'btc') {
  //   await Paxful.create({
  //     btcAmount: this.price.value,
  //     withdrawFee: this.fee.value,
  //     transactionType: 'outflow',
  //     btcAccount: btcAccount._id,
  //     usdVndRate: this.usdVndRate,
  //     btcUsdRate: this.btcUsdRate,
  //   });
  // }

  // await Transaction.create({
  //   fromAccount: this.btcAccount,
  //   toAccount: this.account,
  //   amountSpent: {
  //     value: this.price.value * 1,
  //     currency: this.price.currency,
  //   },
  //   amountSpentFee: {
  //     value: this.fee.value,
  //     currency: this.fee.currency,
  //   },
  //   amountReceived: {
  //     value: this.giftCardValue * 1,
  //     currency: 'btc',
  //   },
  // });

  // await Transaction.create({
  //   transactionType: 'inflow',
  //   amount: this.giftCardValue,
  //   accountID: this.account,
  // });

  // await btcAccount.save();
  // update btc account
  // await Account.findOneAndUpdate(
  //   { _id: btcAccount._id },
  //   {
  //     $set: {
  //       balance:
  //         Math.round(btcAccountBalance * MUL - totalBtcNeeded * MUL) / MUL,
  //     },
  //   }
  // );
  await Promise.all(paxfuls);

  /////////////////////////////////////////////////////////////////////////////////////////////
  // Query paxful documents that have remaining > 0, sorted by date
  // const paxfuls = await Paxful.aggregate([
  //   {
  //     $match: {
  //       'remainingBalance.amount': {
  //         $gt: 0,
  //       },
  //       transactionType: 'inflow',
  //     },
  //   },
  //   {
  //     $sort: {
  //       createdAt: 1,
  //     },
  //   },
  //   {
  //     $project: {
  //       remainingBalance: 1,
  //       btcAccount: 1,
  //     },
  //   },
  // ]);

  // if (paxfuls.length === 0) {
  //   return next(new AppError('not enough BTC', 400));
  // }

  // let remainingBtcNeeded =
  //   Math.round(
  //     parseFloat(this.priceInBtc) * 100000000 +
  //       parseFloat(this.feeBtc) * 100000000
  //   ) / 100000000;
  // let remainingGc = parseFloat(this.giftCardValue);
  // const totalBtcNeeded = remainingBtcNeeded;
  // const rates = [];
  // let index = 0;

  // // Keep taking BTC from paxful transaction
  // while (
  //   index < paxfuls.length &&
  //   remainingBtcNeeded > parseFloat(paxfuls[index].remainingBalance.amount)
  // ) {
  //   const paxful = paxfuls[index];
  //   const vndBtcRate = parseFloat(paxful.remainingBalance.rating);
  //   const remainingBtcInPaxful = parseFloat(paxful.remainingBalance.amount);
  //   const vndGcRate =
  //     Math.round(
  //       (vndBtcRate * 100000000 * totalBtcNeeded) /
  //         parseFloat(this.giftCardValue)
  //     ) / 100000000;
  //   const giftCardBalance =
  //     Math.round(
  //       ((remainingBtcInPaxful * parseFloat(this.giftCardValue) * 100000000) /
  //         (totalBtcNeeded * 100000000)) *
  //         100000000
  //     ) / 100000000;
  //   const partialRate = {
  //     actualCostRate: vndGcRate,
  //     remainingBalance: giftCardBalance,
  //   };
  //   remainingGc -= giftCardBalance;
  //   rates.push(partialRate);

  //   remainingBtcNeeded =
  //     (remainingBtcNeeded * 100000000 - remainingBtcInPaxful * 100000000) /
  //     100000000;
  //   paxfuls[index] = Paxful.updateOne(
  //     { _id: paxful._id },
  //     {
  //       $set: {
  //         'remainingBalance.amount': 0,
  //       },
  //     }
  //   );
  //   index += 1;
  // }

  // if (index >= paxfuls.length) {
  //   return next(new AppError('not enought BTC', 400));
  // }

  // // last paxful transaction to be consumed
  // const paxful = paxfuls[index];
  // const vndBtcRate = parseFloat(paxful.remainingBalance.rating);
  // const vndGcRate =
  //   Math.round(
  //     ((vndBtcRate * remainingBtcNeeded * 10000000000000000) /
  //       (remainingGc * 10000000000000000)) *
  //       100000000
  //   ) / 100000000;
  // const parialRate = {
  //   actualCostRate: vndGcRate,
  //   remainingBalance: remainingGc,
  // };

  // rates.push(parialRate);

  // const remainingBtcInPaxful =
  //   Math.round(
  //     parseFloat(paxful.remainingBalance.amount) * 100000000 -
  //       remainingBtcNeeded * 100000000
  //   ) / 100000000;

  // paxfuls[index] = Paxful.updateOne(
  //   { _id: paxful._id },
  //   {
  //     $set: {
  //       'remainingBalance.amount': remainingBtcInPaxful,
  //     },
  //   }
  // );

  // // create partiBalance for current gift card
  // this.partialBalance = rates;

  // const currentAccount = await Account.findById(this.account);

  // if (!currentAccount) return next(new AppError('Account not found', 400));
  // const newBalance =
  //   Math.round(
  //     parseFloat(currentAccount.balance) * 100000000 +
  //       this.giftCardValue * 100000000
  //   ) / 100000000;
  // currentAccount.balance = newBalance;

  // await Paxful.create({
  //   btcAmount:
  //     Math.round(this.priceInBtc * 100000000 + this.feeBtc * 100000000) /
  //     100000000,
  //   transactionType: 'outflow',
  //   btcAccount: '5f1a64c7af3f082e6f496f67',
  // });

  // await Transaction.create({
  //   transactionType: 'inflow',
  //   amount: this.giftCardValue,
  //   accountID: this.account,
  // });

  // await currentAccount.save();
  // await Promise.all(paxfuls);

  ///////////////////////////////////////////////////////////////////////////////////////////

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
