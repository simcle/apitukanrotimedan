const express = require('express');
const router = express.Router();

const salesController = require('../controller/sales');

router.post('/', salesController.insertSales);
router.get('/draft', salesController.getDraft);
router.get('/branch', salesController.getSalesByBranch);
router.put('/', salesController.updateSales);
router.delete('/:id', salesController.deleteSales);

module.exports = router;