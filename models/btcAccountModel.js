const mongoose = require('mongoose');
const getNextSequence = require('../utils/getNextSequence');

const btcAccountSchema = mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  loginID: {
    type: String,
    required: [true, 'A BTC Account must have a loginID'],
  },
  accountWebsite: {
    type: String,
    required: [true, 'A BTC Account must have account website'],
  },
  balance: {
    type: mongoose.Decimal128,
    default: 0,
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
  notes: String,
  customId: {
    type: String,
    unique: true,
  },
});

btcAccountSchema.pre('save', async function (next) {
  const res = await getNextSequence('btcAccount');
  this.customId = `BTC-ACCT-${res}`;

  next();
});

const btcAccountModel = mongoose.model('btcAccount', btcAccountSchema);

module.exports = btcAccountModel;
