const express = require('express');
const router = express.Router();

const transferController = require('../controller/transferIngredients');

router.get('/', transferController.getAllTransfer);
router.post('/', transferController.insertTransfer);

module.exports = router