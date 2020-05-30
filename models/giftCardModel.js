const mongoose = require('mongoose');
const Paxful = require('../models/paxfulModel');
const Decimal = require('decimal.js');

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
  remainingBalance: mongoose.Decimal128,
  partialBalance: [
    {
      actualCostRate: mongoose.Decimal128,
      remainingBalance: mongoose.Decimal128,
    },
  ],
});

giftCardSchema.pre('save', function (next) {
  this.remainingBalance = this.giftCardValue;

  next();
});

giftCardSchema.pre('save', async function (next) {
  const query = Paxful.find({ remainingBalance: { $ne: 0 } }).sort({ date: 1 });

  let remaining = parseFloat(this.priceInBTC);
  const total = parseFloat(this.priceInBTC);
  let index = 0;
  let paxful;
  const rates = [];

  const paxfuls = await query;

  while (remaining > parseFloat(paxfuls[index].remainingBalance)) {
    paxful = paxfuls[index];
    const balance = parseFloat(paxful.remainingBalance);
    const moneySpent = parseFloat(paxful.moneySpent.amount);
    const bitcoinSpent = parseFloat(paxful.btcAmount);
    const rate =
      Math.round(
        (moneySpent * total * 100000000) /
          (bitcoinSpent * parseFloat(this.giftCardValue))
      ) / 100000000;

    const partial = {
      rate,
      balance,
    };
    rates.push(partial);
    remaining = (remaining * 100000000 - balance * 100000000) / 100000000;
    await Paxful.update(
      { _id: paxful.id },
      {
        $set: {
          remainingBalance: 0,
        },
      }
    );
    // paxful.remainingBalance = 0;
    // await paxful.save();
    index++;
  }
  paxful = paxfuls[index];
  const balance = parseFloat(paxful.remainingBalance);
  const moneySpent = parseFloat(paxful.moneySpent.amount);
  const bitcoinSpent = parseFloat(paxful.btcAmount);
  // const rate = (cost * total) / (bitcoinSpent * parseFloat(this.giftCardValue));
  const rate =
    Math.round(
      (moneySpent * total * 100000000) /
        (bitcoinSpent * parseFloat(this.giftCardValue))
    ) / 100000000;
  const partial = {
    rate,
    balance,
  };
  rates.push(partial);

  // remaining for paxful
  remaining = (balance * 100000000 - remaining * 100000000) / 100000000;
  await Paxful.update(
    { _id: paxful.id },
    {
      $set: {
        remainingBalance: remaining,
      },
    }
  );
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

  console.log(paxful);
  console.log(parseFloat(remaining));
  console.log(rates);

  next();
});

const giftCardModel = mongoose.model('GiftCard', giftCardSchema);

module.exports = giftCardModel;
