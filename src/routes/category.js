const express = require('express');
const router = express.Router();

const categoryController = require('../controller/category');

router.post('/', categoryController.insertCategory);
router.get('/search', categoryController.searchCategory);
module.exports = router;