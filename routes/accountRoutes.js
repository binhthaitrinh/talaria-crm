const express = require('express');
const accountControllers = require('../controllers/accountControllers');

const accountRouter = express.Router();

accountRouter.get('/:id/transactions', accountControllers.getTransactions);

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
