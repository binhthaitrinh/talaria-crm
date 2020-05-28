const express = require('express');
const transactionControllers = require('../controllers/transactionControllers');

const transactionRouter = express.Router({ mergeParams: true });

transactionRouter
  .route('/')
  .get(transactionControllers.getAllTransactions)
  .post(transactionControllers.createTransaction);

module.exports = transactionRouter;
