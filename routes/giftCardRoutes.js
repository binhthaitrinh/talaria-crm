const express = require('express');
const giftCardControllers = require('../controllers/gifCardControllers');

const giftCardRouter = express.Router();

giftCardRouter
  .route('/')
  .post(giftCardControllers.createGiftCard)
  .get(giftCardControllers.getAllGiftCard);

giftCardRouter
  .route('/:id')
  .patch(giftCardControllers.updateGiftCard)
  .get(giftCardControllers.getOneGiftCard)
  .delete(giftCardControllers.deleteGiftCard);

module.exports = giftCardRouter;
