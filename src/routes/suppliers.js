const express = require('express');
const router = express.Router();

const supplierController = require('../controller/suppliers');

router.get('/', supplierController.getAllSupplier);
router.post('/', supplierController.insertSuppler);
router.put('/', supplierController.updateSupplier);

module.exports = router