const express = require('express');
const router = express.Router();

const branchController = require('../controller/branches');

router.get('/', branchController.getBranches);
router.post('/', branchController.insertBranch);
router.put('/', branchController.updateBranch);

module.exports = router;