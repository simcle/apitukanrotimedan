const express = require('express');
const router = express.Router();

const countryController = require('../controller/country');

router.get('/provinces', countryController.getAllProvinces);
router.get('/cities', countryController.getCities);
router.get('/subdistricts', countryController.getSubdistricts);

module.exports = router