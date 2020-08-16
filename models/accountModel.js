const mongoose = require('mongoose');
const getNextSequence = require('../utils/getNextSequence');

const accountSchema = mongoose.Schema(
  {
    accountWebsite: {
      type: String,
      enum: [
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
      type: mongoose.Decimal128,
      default: 0,
    },
    currency: {
      type: String,
      enum: ['vnd', 'usd', 'btc'],
      required: [true, 'An account must have currency'],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    accountType: {
      type: String,
      enum: ['owned', 'borrowed'],
      required: [true, 'An account must belong to a type'],
    },
    notes: String,
    status: {
      type: String,
      enum: ['active', 'inactive', 'disputing'],
      default: 'active',
    },
    customId: {
      type: String,
      unique: true,
    },
  },
  {
    // to include virtual properties into results
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// accountSchema.virtual('transactions', {
//   ref: 'Transaction',
//   foreignField: 'toAccount',
//   localField: '_id',
// });

// accountSchema.virtual('transactions', {
//   ref: 'Transaction',
//   foreignField: 'fromAccount',
//   localField: '_id',
// });

accountSchema.pre('save', async function (next) {
  const res = await getNextSequence('account');
  this.customId = `ACCOUNT-${res}`;

  next();
});

const accountModel = mongoose.model('Account', accountSchema);

module.exports = accountModel;
