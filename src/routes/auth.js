const express = require('express');
const router = express.Router();

const authController = require('../controller/auth');

const authenticateToken = require('../../authenticate');
router.get('/me', authenticateToken, authController.getMe);
router.post('/register', authController.UserRegister);
router.post('/login', authController.UserLogin);
router.post('/refresh-token', authController.RefreshToken);
router.delete('/logout', authController.UserLogout);
router.post('/resetPassword/:token', authController.resetPassword);

module.exports = router;