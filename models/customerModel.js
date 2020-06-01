const mongoose = require('mongoose');

const customerSchema = mongoose.Schema({
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
  discountRate: mongoose.Decimal128,
  notes: String,
  bankAccounts: [
    {
      accountNumber: String,
      bankName: String,
    },
  ],
  date: {
    type: Date,
    default: Date.now(),
  },
  dateOfBirth: Date,
});

const customerModel = mongoose.model('Customer', customerSchema);

module.exports = customerModel;
