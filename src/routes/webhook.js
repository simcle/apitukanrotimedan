const express = require('express');
const router = express.Router();

const webhookController = require('../controller/webhook');
router.post('/', webhookController.webhook);

module.exports = router