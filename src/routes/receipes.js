const express = require('express');
const router = express.Router();

const receipeController = require('../controller/receipes');

router.get('/items', receipeController.getItems);
router.get('/ingredients', receipeController.getIngredients);
router.get('/', receipeController.getAllReceipes);
router.post('/', receipeController.insertReceipes);
router.put('/', receipeController.updateReceipes);

module.exports = router