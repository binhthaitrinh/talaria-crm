const express = require('express');
const btcAccountControllers = require('../controllers/btcAccountControllers');

const btcAccountRouter = express.Router();

btcAccountRouter
  .route('/')
  .get(btcAccountControllers.getAllAccounts)
  .post(btcAccountControllers.createAccount);

btcAccountRouter
  .route('/:id')
  .get(btcAccountControllers.getOneAccount)
  .patch(btcAccountControllers.updateAccount)
  .delete(btcAccountControllers.deleteAccount);

module.exports = btcAccountRouter;
