const express = require('express');
const affiliateControllers = require('../controllers/affiliateControllers');
const affiliateRouter = express.Router();

affiliateRouter.patch('/:id/:year/:month', affiliateControllers.payCommission);

affiliateRouter
  .route('/')
  .get(affiliateControllers.getAllAffiliate)
  .post(affiliateControllers.createAffiliate);

affiliateRouter
  .route('/:id')
  .get(affiliateControllers.getOneAffiliate)
  .patch(affiliateControllers.updateAffiliate);

affiliateRouter.get('/:id/commission', affiliateControllers.calcCommission);

module.exports = affiliateRouter;
