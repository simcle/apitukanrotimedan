const express = require('express');
const router = express.Router()

const incomingItemController = require('../controller/incomingItems');

router.get('/items', incomingItemController.getItems)
router.get('/', incomingItemController.getIncoming);
router.post('/', incomingItemController.insertIncoming)

module.exports = router