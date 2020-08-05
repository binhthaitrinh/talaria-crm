const express = require('express');
const compensationControllers = require('../controllers/compensationControllers');

const compensationRouter = express.Router();

compensationRouter.get(
  '/:id/:year/:month',
  compensationControllers.getMonthlyCompensations
);

compensationRouter
  .route('/')
  .get(compensationControllers.getCompensations)
  .post(compensationControllers.createCompensation);

compensationRouter
  .route('/:id')
  .get(compensationControllers.getCompensation)
  .patch(compensationControllers.updateCompensation)
  .delete(compensationControllers.deleteCompensation);

module.exports = compensationRouter;
