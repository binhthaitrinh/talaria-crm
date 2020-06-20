const express = require('express');
const accountControllers = require('../controllers/accountControllers');
const transactionRouter = require('./transactionRoutes');

const accountRouter = express.Router();

accountRouter.use('/:accountId/transactions', transactionRouter);

accountRouter
  .route('/')
  .get(accountControllers.getAllAccounts)
  .post(accountControllers.createAccount);

accountRouter
  .route('/:id')
  .get(accountControllers.getOneAccount)
  .patch(accountControllers.updateAccount)
  .delete(accountControllers.deleteAccount);

module.exports = accountRouter;
