const mongoose = require('mongoose');

const customerSchema = mongoose.Schema(
  {
    customerName: {
      type: String,
      required: [true, 'A customer must have a name'],
    },
    customerType: {
      type: String,
      enum: ['personal', 'wholesale'],
      required: [true, 'A customer must belong to a group'],
    },
    address: [
      {
        address1: {
          type: 'String',
          required: [true, 'Address must have first line'],
        },
        address2: String,
        city: String,
        notes: String,
      },
    ],
    phoneNumber: String,
    discountRate: {
      type: mongoose.Decimal128,
      default: 18,
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
  },
  {
    // to include virtual properties into results
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

customerSchema.virtual('transactions', {
  ref: 'Bill',
  foreignField: 'customer',
  localField: '_id',
});

const customerModel = mongoose.model('Customer', customerSchema);

module.exports = customerModel;
