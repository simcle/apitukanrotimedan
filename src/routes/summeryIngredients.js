const express = require('express');
const router = express.Router();

const summaryIngredientController = require('../controller/summaryIngredients');

router.get('/', summaryIngredientController.getAllSummary);

module.exports = router;