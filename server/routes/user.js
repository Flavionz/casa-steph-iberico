const express = require('express');
const { authenticate } = require('../middleware/authMiddleware');
const {
    getUserProfile,
    updateUserProfile,
    updatePassword,
    getUserOrders,
    getUserOrderById
} = require('../controllers/userController');

const router = express.Router();

router.get('/profile', authenticate, getUserProfile);
router.put('/profile', authenticate, updateUserProfile);
router.put('/password', authenticate, updatePassword);
router.get('/orders', authenticate, getUserOrders);
router.get('/orders/:id', authenticate, getUserOrderById);

module.exports = router;