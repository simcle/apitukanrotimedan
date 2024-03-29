const express = require('express');
const router = express.Router();

const adjustmentController = require('../controller/adjustmentIngredients');

router.get('/', adjustmentController.getAllAdjustments);
router.get('/branch', adjustmentController.getAdjustmentByBranch);
router.post('/', adjustmentController.insertAdjustment);

module.exports = router;