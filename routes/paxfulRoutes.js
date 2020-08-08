const express = require('express');
const paxfulControllers = require('../controllers/paxfulControllers');
const paxfulRouter = express.Router();

paxfulRouter.get('/stats', paxfulControllers.getStats);

paxfulRouter
  .route('/')
  .get(paxfulControllers.getAllPaxful)
  .post(paxfulControllers.createPaxful);

paxfulRouter
  .route('/:id')
  .patch(paxfulControllers.updatePaxful)
  .get(paxfulControllers.getOne)
  .delete(paxfulControllers.deletePaxful);

module.exports = paxfulRouter;
