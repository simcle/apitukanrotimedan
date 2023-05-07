const express = require('express');
const router = express.Router();

const employeeController = require('../controller/employee');

router.get('/', employeeController.getAllEmployees);
router.get('/create', employeeController.createEmplloye);
router.post('/', employeeController.insertEmployees);

module.exports = router;