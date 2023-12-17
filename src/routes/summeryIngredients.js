const express = require('express');
const router = express.Router();

const summaryIngredientController = require('../controller/summaryIngredients');

router.get('/', summaryIngredientController.getAllSummary);
router.get('/download', summaryIngredientController.downloadSummary);

module.exports = router;