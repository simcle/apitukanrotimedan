const express = require('express');
const router = express.Router();

const adjustmentController = require('../controller/adjustmentItems');

router.get('/branch', adjustmentController.getAdjustmentByBranch);
router.post('/', adjustmentController.insertAdjustment);


module.exports = router