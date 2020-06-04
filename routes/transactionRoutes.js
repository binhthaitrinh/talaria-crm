const express = require('express');
const transactionControllers = require('../controllers/transactionControllers');

const transactionRouter = express.Router({ mergeParams: true });

transactionRouter.get('/stats', transactionControllers.getStats);

transactionRouter
  .route('/')
  .get(transactionControllers.getAllTransactions)
  .post(transactionControllers.createTransaction);

module.exports = transactionRouter;
