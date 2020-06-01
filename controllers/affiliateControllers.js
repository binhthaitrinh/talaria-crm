const Affiliate = require('../models/affiliateModel');
const factory = require('./handleFactory');

exports.getAllAffiliate = factory.getAll(Affiliate);

exports.createAffiliate = factory.createOne(Affiliate);
