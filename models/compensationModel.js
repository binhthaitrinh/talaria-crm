const mongoose = require('mongoose');
const getNextSequence = require('../utils/getNextSequence');

const compensationSchema = mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  bill: {
    type: mongoose.Schema.ObjectId,
    ref: 'Bill',
  },
  affiliate: {
    type: mongoose.Schema.ObjectId,
    ref: 'Affiliate',
  },
  amount: mongoose.Decimal128,
  status: {
    type: String,
    enum: ['paid', 'pending', 'bill-not-paid'],
    default: 'pending',
  },

  customId: {
    type: String,
    unique: true,
  },
});

compensationSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'bill',
    select: 'actualChargeCustomer -items -customer',
  });

  next();
});

compensationSchema.pre('save', async function (next) {
  const res = await getNextSequence('compensation');
  this.customId = `COMPENSATION-${res}`;

  next();
});

const compensationModel = mongoose.model('Compensation', compensationSchema);

module.exports = compensationModel;
