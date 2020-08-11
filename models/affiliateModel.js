const mongoose = require('mongoose');
const getNextSequence = require('../utils/getNextSequence');

const affiliateSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'An Affiliate must have a name'],
  },
  lastName: String,
  socialMediaLinks: [
    {
      socialMediaType: {
        type: String,
        enum: ['facebook', 'instagram', 'tiktok', 'pinterest'],
      },
      link: String,
    },
  ],
  phoneNumber: String,
  commissionRate: {
    type: mongoose.Decimal128,
    default: 0,
    min: [0, 'Commission Rate must be positive'],
    max: [1, 'Commission Rate cannot be more than 100%'],
  },

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
  notes: String,
  customId: {
    type: String,
    unique: true,
  },
});

affiliateSchema.pre('save', async function (next) {
  const res = await getNextSequence('affiliate');
  this.customId = `AFFILIATE-${res}`;

  next();
});

const affiliateModel = mongoose.model('Affiliate', affiliateSchema);

module.exports = affiliateModel;
