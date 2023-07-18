const express = require('express');
const router = express.Router();

const brandController = require('../controller/brand');

router.post('/', brandController.insertBrand);
router.get('/search', brandController.searchBrand);

module.exports = router;