const express = require('express');
const router = express.Router();
const billingController = require('../controllers/billingController');
const { authenticateToken } = require('../middleware/auth');

router.post('/transaction', authenticateToken, billingController.createTransaction);
router.get('/transactions', authenticateToken, billingController.getTransactions);
router.get('/transaction/:id', authenticateToken, billingController.getTransactionById);

module.exports = router;
