const express = require('express');
const router = express.Router();

const purchasingController = require('../controller/purchasing');

router.get('/ingredients', purchasingController.getIngredients);
router.get('/supplier', purchasingController.getAllSupplier);
router.get('/', purchasingController.getAllPurchasing);
router.post('/', purchasingController.insertPurchasing);
router.put('/', purchasingController.updatePurchasing);
router.post('/cancel/:id', purchasingController.cancelPurchasing);

module.exports = router;