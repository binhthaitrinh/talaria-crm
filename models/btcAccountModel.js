const mongoose = require('mongoose');

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
});

const btcAccountModel = mongoose.model('btcAccount', btcAccountSchema);

module.exports = btcAccountModel;
