const Customer = require('../models/customerModel');
const factory = require('./handleFactory');

exports.getAllCustomers = factory.getAll(Customer);

exports.createCustomer = factory.createOne(Customer);
