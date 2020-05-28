const express = require('express');

const itemRouter = express.Router();

itemRouter.route('/').get(getAllItems);

module.exports = itemRouter;
