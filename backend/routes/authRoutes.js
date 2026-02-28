const express = require('express');
const { registerUser, loginUser, getProfile } = require('../controllers/authController');
const { createBill, createBillApprovalRequest, getBillStatus, getMyTransactions } = require('../controllers/billController');
const protect = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.post('/signup', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getProfile);
router.post('/bills', protect, upload.single('billImage'), createBill);
router.post('/bills/request', protect, upload.single('billImage'), createBillApprovalRequest);
router.get('/bills/:billId/status', protect, getBillStatus);
router.get('/transactions', protect, getMyTransactions);

module.exports = router;
