const mongoose = require('mongoose');
const getNextSequence = require('../utils/getNextSequence');

const customerSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'A customer must have first name'],
    },
    lastName: {
      type: String,
    },
    customerType: {
      type: String,
      enum: ['personal', 'wholesale'],
      required: [true, 'A customer must belong to a group'],
    },
    address: [
      {
        address1: {
          type: String,
          required: [true, 'Address must have first line'],
        },
        address2: String,
        city: {
          type: String,
          required: [true, 'There must be a city'],
        },
      },
    ],
    phoneNumber: String,
    discountRate: {
      amazon: {
        type: mongoose.Decimal128,
        default: 0.08,
      },
      sephora: {
        type: mongoose.Decimal128,
        default: 0.08,
      },
      ebay: {
        type: mongoose.Decimal128,
        default: 0.08,
      },
      bestbuy: {
        type: mongoose.Decimal128,
        default: 0.08,
      },
      costco: {
        type: mongoose.Decimal128,
        default: 0.08,
      },
      walmart: {
        type: mongoose.Decimal128,
        default: 0.08,
      },
      assisting: {
        type: mongoose.Decimal128,
        default: -0.05,
      },
    },
    // type: mongoose.Decimal128,
    // default: 0.08,
    notes: String,
    bankAccounts: [
      {
        accountNumber: String,
        bankName: String,
      },
    ],
    socialMediaLinks: [
      {
        socialMediaType: {
          type: String,
          enum: [
            'facebook',
            'instagram',
            'tiktok',
            'pinterest',
            'zalo',
            'telegram',
            'others',
          ],
        },
        link: String,
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    dateOfBirth: Date,
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

customerSchema.virtual('bills', {
  ref: 'Bill',
  foreignField: 'customer',
  localField: '_id',
  options: {
    sort: '-createdAt -_id',
  },
});

customerSchema.pre('save', async function (next) {
  const res = await getNextSequence('customer');
  this.customId = `CUSTOMER-${res}`;

  next();
});

const customerModel = mongoose.model('Customer', customerSchema);

module.exports = customerModel;
