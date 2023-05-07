const express = require('express');
const router = express.Router();

const merchantController = require('../controller/merchants');

router.get('/', merchantController.getMerchants);
router.post('/', merchantController.insertMerchant);
router.put('/', merchantController.updateMerchant);

module.exports = router;