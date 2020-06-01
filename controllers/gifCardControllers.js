const giftCardModel = require('../models/giftCardModel');
const factory = require('./handleFactory');

exports.createGiftCard = factory.createOne(giftCardModel);

exports.getAllGiftCard = factory.getAll(giftCardModel);