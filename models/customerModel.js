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
      required: [true, 'A customer must have last name'],
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
        notes: String,
      },
    ],
    phoneNumber: String,
    discountRate: {
      type: mongoose.Decimal128,
      default: 0.08,
      min: [0, 'discount rate must be larger than 0'],
      max: [1, 'discount rate cannot be larger than 1'],
    },
    notes: String,
    bankAccounts: [
      {
        accountNumber: String,
        bankName: String,
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
