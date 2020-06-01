const express = require('express');

const billRouter = express.Router();
const billControllers = require('../controllers/billControllers');

billRouter
  .route('/')
  .get(billControllers.getAllBill)
  .post(billControllers.createBill);

module.exports = billRouter;
