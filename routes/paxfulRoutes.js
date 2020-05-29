const express = require('express');
const paxfulControllers = require('../controllers/paxfulControllers');

const paxfulRouter = express.Router();

paxfulRouter
  .route('/')
  .get(paxfulControllers.getAllPaxful)
  .post(paxfulControllers.createPaxful);

paxfulRouter.route('/:id').patch(paxfulControllers.updatePaxful);

module.exports = paxfulRouter;
