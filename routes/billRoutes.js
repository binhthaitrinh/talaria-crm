const express = require('express');

const billRouter = express.Router();
const billControllers = require('../controllers/billControllers');

billRouter.route('/:id').get(billControllers.getBill);

billRouter.post('/:id/pay', billControllers.customerPay);

billRouter
  .route('/')
  .get(billControllers.getAllBill)
  .post(billControllers.createBill);

module.exports = billRouter;
