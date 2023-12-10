const express = require('express');
const router = express.Router();

const invnetoryItemController = require('../controller/inventoryItems');

router.get('/', invnetoryItemController.getAllItems);

module.exports = router;