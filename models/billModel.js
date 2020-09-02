const mongoose = require('mongoose');
const Transaction = require('./transactionModel');
const Customer = require('./customerModel');
const Account = require('./accountModel');
const Compensation = require('./compensationModel');
const AppError = require('../utils/appError');
const getNextSequence = require('../utils/getNextSequence');

const MUL = 100000000;

const billSchema = mongoose.Schema(
  {
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    // items: [
    //   {
    //     type: mongoose.Schema.ObjectId,
    //     ref: 'Item',
    //   },
    // ],
    usdVndRate: {
      type: mongoose.Decimal128,
      required: [true, 'A bill must have usd/vnd rate'],
    },
    customer: {
      type: mongoose.Schema.ObjectId,
      ref: 'Customer',
      required: [true, 'A bill must belong to a customer'],
    },
    affiliate: {
      type: mongoose.Schema.ObjectId,
      ref: 'Affiliate',
      //  required: [true, 'A bill must have an affiliate'],
    },
    status: {
      type: String,
      enum: ['not-paid', 'partially-paid', 'fully-paid'],
      default: 'not-paid',
    },

    estimatedWeight: mongoose.Decimal128,
    shippingRateToVn: {
      currency: {
        type: String,
        enum: ['usd', 'vnd'],
        default: 'usd',
      },
      value: {
        type: mongoose.Decimal128,
        default: 12,
      },
    },

    taxForCustomer: {
      type: mongoose.Decimal128,
      default: 0.0875,
      min: [0, 'Tax cannot be negative'],
      max: [1, 'Tax cannot be more than 100%'],
    },
    moneyReceived: {
      type: mongoose.Decimal128,
      default: 0,
    },
    remaining: mongoose.Decimal128,
    actualBillCost: mongoose.Decimal128,
    moneyChargeCustomerUSD: mongoose.Decimal128,
    actualChargeCustomer: mongoose.Decimal128,

    // moneyChargeCustomerVND: mongoose.Decimal128,

    moneyTransferReceipt: String,
    customId: {
      type: String,
      unique: true,
    },
    notes: String,
    commissionForAffiliate: mongoose.Decimal128,

    // actualCost: mongoose.Decimal128,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

billSchema.virtual('items', {
  ref: 'Item',
  foreignField: 'bill',
  localField: '_id',
});

billSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'customer',
    select: 'firstName lastName customerType discountRate address phoneNumber',
  });

  next();
});

billSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'items',
    select:
      'name tax quantity pricePerItem createdAt usShippingFee orderedWebsite estimatedWeightPerItem -orderAccount',
  });

  next();
});

billSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'affiliate',
    select: 'firstName lastName commissionRate',
  });

  next();
});

billSchema.pre('save', async function (next) {
  const res = await getNextSequence('bill');
  this.customId = `BILL-${res}`;

  next();
});

billSchema.post('save', async function () {
  await Compensation.create({
    bill: this._id,
    status: 'bill-not-paid',
    //  affiliate: this.affiliate,
  });
});

// TODO: handle when no affiliate is added yet

billSchema.statics.customerPay = async function (id, amount) {
  // find the bill doc to be paid
  const bill = await this.findOne({ _id: id }).select(
    'moneyReceived remaining actualChargeCustomer status -customer'
  );

  if (bill.status === 'fully-paid') {
    return new AppError('Bill already paid', 400);
  }

  // // update amountPaid
  // const moneyReceived = parseFloat(bill.moneyReceived) + parseFloat(amount);

  const moneyReceived =
    Math.round(
      parseFloat(bill.moneyReceived) * 100000000 +
        parseFloat(amount) * 100000000
    ) / 100000000;

  // update remaining
  const remaining =
    Math.round(
      parseFloat(bill.actualChargeCustomer) * 100000000 -
        parseFloat(moneyReceived) * 100000000
    ) / 100000000;

  const newBill = await this.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        // moneyReceived,
        remaining,
        status: remaining > 0 ? 'partially-paid' : 'fully-paid',
        moneyReceived,
      },
    },
    { returnOriginal: false }
  );

  const transaction = await Transaction.create({
    toAccount: '5f24a4e06666190fbdf6e7bc',
    amountReceived: {
      value: amount,
      currency: 'vnd',
    },
    bill: id,
  });

  // await Account.findOneAndUpdate(
  //   { loginID: 'VND_ACCOUNT' },
  //   {
  //     $inc: {
  //       balance: amount * 1,
  //     },
  //   }
  // );

  if (newBill.status === 'fully-paid') {
    await Compensation.findOneAndUpdate(
      { bill: bill._id },
      {
        amount:
          Math.round(
            parseFloat(bill.actualChargeCustomer) *
              100000000 *
              parseFloat(bill.affiliate.commissionRate)
          ) / 100000000,
        status: 'pending',
      }
    );
    // await Compensation.create({
    //   bill: id,
    //   status: 'pending',
    //   affiliate: bill.affiliate._id,
    //   amount:
    //     Math.round(
    //       parseFloat(bill.actualChargeCustomer) *
    //         100000000 *
    //         parseFloat(bill.affiliate.commissionRate)
    //     ) / 100000000,
    // });
  }

  // update bill status
  return newBill;
};

// TODO: write function to calculate commission for affiliate
billSchema.statics.calcCommission = async function (doc) {
  if (!doc.affiliate) {
    return new AppError('Cannot calculate commission without affiliate', 400);
  }

  let commissionForAffiliate = 0;
  doc.items.forEach((item) => {
    console.log(item);
    console.log(item.commissionRateForAffiliate);
    let singleCom;
    if (item.commissionRateForAffiliate !== undefined) {
      singleCom =
        parseFloat(item.commissionRateForAffiliate) *
        (parseFloat(item.pricePerItem) *
          parseFloat(item.quantity) *
          (1 + parseFloat(item.tax) * 1) +
          parseFloat(item.usShippingFee) * 1);
    } else {
      console.log(
        'asdqw',
        parseFloat(doc.affiliate.commissionRate[item.orderedWebsite])
      );
      singleCom =
        parseFloat(doc.affiliate.commissionRate[item.orderedWebsite]) *
        (parseFloat(item.pricePerItem) *
          parseFloat(item.quantity) *
          (1 + parseFloat(item.tax) * 1) +
          parseFloat(item.usShippingFee) * 1);
      console.log('asdqw', parseFloat(singleCom));
    }
    commissionForAffiliate += singleCom;
  });

  await this.findOneAndUpdate(
    { _id: doc._id },
    { commissionForAffiliate: commissionForAffiliate }
  );
};

const billModel = mongoose.model('Bill', billSchema);

module.exports = billModel;
