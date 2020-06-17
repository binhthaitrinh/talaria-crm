const express = require('express');
const transactionControllers = require('../controllers/transactionControllers');

const transactionRouter = express.Router({ mergeParams: true });

transactionRouter.get('/', (req, res) => {
  return res.status(200).json({
    status: 'success',
    data: 1,
  });
});
