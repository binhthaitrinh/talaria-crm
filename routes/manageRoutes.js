const express = require('express');
const manageControllers = require('../controllers/manageControllers');

const manageRouter = express.Router();

manageRouter.get('/', manageControllers.getStats);

module.exports = manageRouter;
