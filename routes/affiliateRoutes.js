const express = require('express');
const affiliateControllers = require('../controllers/affiliateControllers');
const affiliateRouter = express.Router();

affiliateRouter
  .route('/')
  .get(affiliateControllers.getAllAffiliate)
  .post(affiliateControllers.createAffiliate);

affiliateRouter
  .route('/:id')
  .get(affiliateControllers.getOneAffiliate)
  .patch(affiliateControllers.updateAffiliate);

module.exports = affiliateRouter;
