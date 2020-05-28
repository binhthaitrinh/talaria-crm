const mongoose = require('mongoose');
const validator = require('validator');

const accountSchema = mongoose.Schema(
  {
    accountWebsite: {
      type: String,
      enun: [
        'amazon',
        'sephora',
        'ebay',
        'bestbuy',
        'costco',
        'walmart',
        'others',
      ],
      required: [true, 'An account must come from a website'],
    },
    loginID: {
      type: String,
      require: [true, 'An account must have loginID'],
    },
    teamviewInfo: String,
    balance: {
      type: Number,
      default: 0.1,
    },
    addedAt: {
      type: Date,
      default: Date.now(),
    },
    //   transactionHistory: [
    //     {
    //       transactionType: {
    //         type: String,
    //         enum: ['loaded', 'spent'],
    //         requried: [true, 'A transaction must have a type: loaded or spent'],
    //       },
    //       amount: {
    //         type: mongoose.Decimal128,
    //         require: [true, 'A transaction must have amount'],
    //       },
    //       createdAt: {
    //         type: Date,
    //         default: Date.now(),
    //       },
    //     },
    //   ],
    accountType: {
      type: String,
      enum: ['owned', 'borrowed'],
    },
    notes: String,
    status: {
      type: String,
      enum: ['active', 'inactive', 'disputing'],
      default: 'active',
    },
  },
  {
    // to include virtual properties into results
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

accountSchema.virtual('transactions', {
  ref: 'Transaction',
  foreignField: 'accountID',
  localField: '_id',
});

const accountModel = mongoose.model('Account', accountSchema);

module.exports = accountModel;
