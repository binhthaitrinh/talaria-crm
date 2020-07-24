const btcAccount = require('../models/btcAccountModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handleFactory');

exports.getAllAccounts = factory.getAll(btcAccount);

exports.getOneAccount = factory.getOne(btcAccount);

exports.updateAccount = factory.updateOne(btcAccount);
exports.deleteAccount = factory.deleteOne(btcAccount);

exports.createAccount = factory.createOne(btcAccount);
