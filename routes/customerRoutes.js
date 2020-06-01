const express = require('express');
const customerRouter = express.Router();
const customerControllers = require('../controllers/customerControllers');

customerRouter
  .route('/')
  .get(customerControllers.getAllCustomers)
  .post(customerControllers.createCustomer);

module.exports = customerRouter;
