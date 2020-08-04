const express = require('express');

const billRouter = express.Router({ mergeParams: true });
const billControllers = require('../controllers/billControllers');

billRouter.patch('/:id/updatePrice', billControllers.updatePrice);

billRouter
  .route('/:id')
  .get(billControllers.getBill)
  .delete(billControllers.deleteBill)
  .patch(billControllers.updateBill);

billRouter.post('/:id/pay', billControllers.customerPay);

billRouter
  .route('/')
  .get(billControllers.getAllBill)
  .post(billControllers.createBill);

module.exports = billRouter;
