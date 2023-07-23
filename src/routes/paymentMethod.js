const express = require('express');
const router = express.Router();

const paymentMethodController = require('../controller/paymentMethod');

router.get('/', paymentMethodController.getAllPaymentMethod);
router.post('/', paymentMethodController.insertPaymetnMethod);
router.put('/', paymentMethodController.updatePaymentMethod);
module.exports = router