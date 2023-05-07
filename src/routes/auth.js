const express = require('express');
const router = express.Router();

const authController = require('../controller/auth');

const authenticateToken = require('../../authenticate');
router.get('/me', authenticateToken, authController.getMe);
router.get('/create', authenticateToken, authController.createUser);
router.put('/update', authenticateToken, authController.UserUpdated);
router.put('/password', authenticateToken, authController.UserUpdatePassword);
router.post('/register', authController.UserRegister);
router.post('/login', authController.UserLogin);
router.post('/refresh-token', authController.RefreshToken);
router.delete('/logout', authController.UserLogout);

module.exports = router;