const express = require('express');
const rateLimit = require('express-rate-limit');
const { register, login, verifyToken, logout, forgotPassword, resetPassword } = require('../controllers/authController');

const router = express.Router();

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { error: 'Trop de tentatives, réessayez dans 15 minutes.' },
    standardHeaders: true,
    legacyHeaders: false,
});

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.get('/verify', verifyToken);
router.post('/logout', logout);
router.post('/forgot-password', authLimiter, forgotPassword);
router.post('/reset-password', authLimiter, resetPassword);

module.exports = router;