const express = require('express');
const itemControllers = require('../controllers/itemControllers');

const itemRouter = express.Router();

// itemRouter.patch('/:id/updateCostInfo', itemControllers.updateCostInfo);

itemRouter.route('/:id/charge').post(itemControllers.chargeMoney);

itemRouter.patch('/:id/refund', itemControllers.refund);

itemRouter.patch('/:id/split', itemControllers.split);

itemRouter.post('/:id/generousSeller', itemControllers.generousSeller);

itemRouter.post('/:id/duplicate', itemControllers.duplicate);

itemRouter
  .route('/')
  .get(itemControllers.getAllItems)
  .post(itemControllers.createItem);

itemRouter.route('/:id').get(itemControllers.getOneItem);

itemRouter
  .route('/:id')
  .patch(itemControllers.updateOne)
  .delete(itemControllers.deleteOne);

module.exports = itemRouter;
