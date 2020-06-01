const express = require('express');
const giftCardControllers = require('../controllers/gifCardControllers');

const giftCardRouter = express.Router();

giftCardRouter
  .route('/')
  .post(giftCardControllers.createGiftCard)
  .get(giftCardControllers.getAllGiftCard);

module.exports = giftCardRouter;