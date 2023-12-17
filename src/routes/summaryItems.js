const express = require('express');
const router = express.Router();

const summaryItemController = require('../controller/summaryItems');

router.get('/', summaryItemController.getAllSummary);
router.get('/download', summaryItemController.downloadSummary);

module.exports = router