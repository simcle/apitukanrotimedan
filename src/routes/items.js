const express = require('express');
const router = express.Router();

const itemController = require('../controller/items');

router.get('/', itemController.getItems);
router.get('/sku', itemController.getSku);
router.delete('/:id', itemController.deleteItem);

module.exports = router;