const express = require('express');
const router = express.Router()

const dashboardController = require('../controller/dashboard');

router.get('/', dashboardController.indexDashboard);
router.get('/:status', dashboardController.getAttendenceByStatus);

module.exports = router;