const express = require('express');
const router = express.Router();

const printerController = require('../controller/printer');

router.get('/', printerController.getPrinter);
router.post('/', printerController.insert);

module.exports = router;