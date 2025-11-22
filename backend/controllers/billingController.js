const { db } = require('../config/database');

exports.createTransaction = (req, res) => {
  const { items, payment_method, discount_percentage = 0 } = req.body;
  const cashier_id = req.user.id;

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discount_amount = (subtotal * discount_percentage) / 100;
  const total_amount = subtotal - discount_amount;
  
  // Enhanced fraud detection logic
  let fraud_score = 0;
  let fraud_reasons = [];
  
  if (total_amount > 50000) {
    fraud_score += 30;
    fraud_reasons.push('High transaction amount');
  }
  if (items.length > 20) {
    fraud_score += 20;
    fraud_reasons.push('Too many items');
  }
  if (payment_method === 'cash' && total_amount > 20000) {
    fraud_score += 25;
    fraud_reasons.push('Large cash payment');
  }
  if (discount_percentage > 15) {
    fraud_score += 60;
    fraud_reasons.push(`Excessive discount: ${discount_percentage}%`);
  }
  
  const is_flagged = fraud_score >= 50 ? 1 : 0;

  db.run(
    'INSERT INTO transactions (cashier_id, total_amount, payment_method, fraud_score, is_flagged, discount_percentage) VALUES (?, ?, ?, ?, ?, ?)',
    [cashier_id, total_amount, payment_method, fraud_score, is_flagged, discount_percentage],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      const transaction_id = this.lastID;
      const stmt = db.prepare('INSERT INTO transaction_items (transaction_id, product_id, quantity, price) VALUES (?, ?, ?, ?)');
      
      items.forEach(item => {
        stmt.run([transaction_id, item.product_id, item.quantity, item.price]);
      });
      stmt.finalize();

      res.status(201).json({
        id: transaction_id,
        subtotal,
        discount_percentage,
        discount_amount,
        total_amount,
        fraud_score,
        is_flagged: is_flagged === 1,
        fraud_reasons
      });
    }
  );
};

exports.getTransactions = (req, res) => {
  const query = `
    SELECT t.*, u.username as cashier_name 
    FROM transactions t 
    JOIN users u ON t.cashier_id = u.id 
    ORDER BY t.created_at DESC 
    LIMIT 100
  `;

  db.all(query, [], (err, transactions) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(transactions);
  });
};

exports.getTransactionById = (req, res) => {
  const { id } = req.params;

  db.get('SELECT * FROM transactions WHERE id = ?', [id], (err, transaction) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    db.all('SELECT * FROM transaction_items WHERE transaction_id = ?', [id], (err, items) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ ...transaction, items });
    });
  });
};
