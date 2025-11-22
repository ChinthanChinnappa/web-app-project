const { db } = require('../config/database');

exports.getFlaggedTransactions = (req, res) => {
  const query = `
    SELECT t.*, u.username as cashier_name 
    FROM transactions t 
    JOIN users u ON t.cashier_id = u.id 
    WHERE t.is_flagged = 1 
    ORDER BY t.created_at DESC
  `;

  db.all(query, [], (err, transactions) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(transactions);
  });
};

exports.analyzeTransaction = (req, res) => {
  const { id } = req.params;

  db.get('SELECT * FROM transactions WHERE id = ?', [id], (err, transaction) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    const analysis = {
      transaction_id: transaction.id,
      fraud_score: transaction.fraud_score,
      is_flagged: transaction.is_flagged === 1,
      risk_level: transaction.fraud_score > 70 ? 'High' : transaction.fraud_score > 40 ? 'Medium' : 'Low',
      factors: []
    };

    if (transaction.total_amount > 5000) {
      analysis.factors.push('High transaction amount');
    }
    if (transaction.payment_method === 'cash' && transaction.total_amount > 2000) {
      analysis.factors.push('Large cash payment');
    }

    res.json(analysis);
  });
};
