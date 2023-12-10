const express = require('express');
const router = express.Router();

const InventoryIngredientController = require('../controller/inventoryIngredients');

router.get('/', InventoryIngredientController.getAllIngredients)

module.exports = router;