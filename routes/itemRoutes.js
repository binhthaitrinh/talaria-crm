const express = require('express');
const itemControllers = require('../controllers/itemControllers');

const itemRouter = express.Router();

itemRouter.route('/:id/charge').post(itemControllers.chargeMoney);

itemRouter
  .route('/')
  .get(itemControllers.getAllItems)
  .post(itemControllers.createItem);

module.exports = itemRouter;
