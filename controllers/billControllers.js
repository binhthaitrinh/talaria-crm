const factory = require('./handleFactory');
const Bill = require('../models/billModel');

exports.createBill = factory.createOne(Bill);

exports.getAllBill = factory.getAll(Bill);
