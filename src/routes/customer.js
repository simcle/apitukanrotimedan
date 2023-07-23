const express = require('express');
const router = express.Router();

const customerController = require('../controller/customer');

router.get('/', customerController.getAllCustomer);
router.post('/', customerController.insertCustomer);
router.put('/', customerController.updateCustomer);

module.exports = router