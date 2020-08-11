const Customer = require('../models/customerModel');
const factory = require('./handleFactory');

exports.getAllCustomers = factory.getAll(Customer);

exports.createCustomer = factory.createOne(Customer);

exports.getOneCustomer = factory.getOne(Customer, { path: 'bills' });

exports.updateCustomer = factory.updateOne(Customer);
