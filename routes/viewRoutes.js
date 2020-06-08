const express = require('express');
const router = express.Router();
const viewsControllers = require('../controllers/viewsControllers');

router.get('/', viewsControllers.getItems);

module.exports = router;
