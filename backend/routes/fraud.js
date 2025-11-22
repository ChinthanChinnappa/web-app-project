const express = require('express');
const router = express.Router();
const fraudController = require('../controllers/fraudController');
const { authenticateToken, requireRole } = require('../middleware/auth');

router.get('/flagged', authenticateToken, requireRole('admin'), fraudController.getFlaggedTransactions);
router.get('/analyze/:id', authenticateToken, fraudController.analyzeTransaction);

module.exports = router;
