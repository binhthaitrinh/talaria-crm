const express = require('express');

const billRouter = express.Router({ mergeParams: true });
const billControllers = require('../controllers/billControllers');
const catchAsync = require('../utils/catchAsync');

billRouter.patch('/:id/updatePrice', billControllers.updatePrice);

billRouter.patch('/:id/commissionForAffiliate', billControllers.calcCommission);

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
