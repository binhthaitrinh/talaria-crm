const express = require('express');
const router = express.Router();
const viewsControllers = require('../controllers/viewsControllers');

router.get('/asd/qwe/qwrqweqwe', viewsControllers.getItems);

module.exports = router;
