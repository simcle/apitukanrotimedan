const express = require('express');
const router = express.Router();

const attendenceController = require('../controller/attendence');


router.get('/', attendenceController.getAttendence);
router.put('/update', attendenceController.updateAttendence);
router.get('/report', attendenceController.reportAttendence);
router.get('/download', attendenceController.downloadAttendence);

module.exports = router;