const express = require('express');
const router = express.Router();

const UserController = require('../controller/users');

router.get('/', UserController.getAlluser);


module.exports = router;