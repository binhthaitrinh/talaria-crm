const express = require('express');
const customerRouter = express.Router();
const customerControllers = require('../controllers/customerControllers');
const billRouter = require('./billRoutes');

customerRouter.use('/:customerId/bills', billRouter);

customerRouter
  .route('/')
  .get(customerControllers.getAllCustomers)
  .post(customerControllers.createCustomer);

customerRouter
  .route('/:id')
  .get(customerControllers.getOneCustomer)
  .patch(customerControllers.updateCustomer);

module.exports = customerRouter;
