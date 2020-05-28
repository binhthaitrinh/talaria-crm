const express = require('express');
const transactionControllers = require('../controllers/transactionControllers');

const transactionRouter = express.Router();

transactionRouter.route('/').post(transactionControllers.createTransaction);

module.exports = transactionRouter;
