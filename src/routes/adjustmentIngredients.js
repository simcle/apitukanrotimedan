const express = require('express');
const router = express.Router();

const adjustmentController = require('../controller/adjustmentIngredients');

router.get('/', adjustmentController.getAllAdjustments);
router.post('/', adjustmentController.insertAdjustment);

module.exports = router;