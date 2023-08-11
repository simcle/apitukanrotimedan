const express = require('express');
const router = express.Router();

const salesController = require('../controller/sales');

router.get('/', salesController.getAllSales);
router.get('/download', salesController.downloadSales);
router.post('/', salesController.insertSales);
router.get('/draft', salesController.getDraft);
router.get('/branch', salesController.getSalesByBranch);
router.put('/', salesController.updateSales);
router.delete('/:id', salesController.deleteSales);

module.exports = router;