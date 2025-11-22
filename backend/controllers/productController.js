const { db } = require('../config/database');

exports.getAllProducts = (req, res) => {
  db.all('SELECT * FROM products ORDER BY name', [], (err, products) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(products);
  });
};

exports.createProduct = (req, res) => {
  const { name, price, stock, category } = req.body;

  db.run(
    'INSERT INTO products (name, price, stock, category) VALUES (?, ?, ?, ?)',
    [name, price, stock, category],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.status(201).json({ id: this.lastID, name, price, stock, category });
    }
  );
};

exports.updateProduct = (req, res) => {
  const { id } = req.params;
  const { name, price, stock, category } = req.body;

  db.run(
    'UPDATE products SET name = ?, price = ?, stock = ?, category = ? WHERE id = ?',
    [name, price, stock, category, id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ message: 'Product updated successfully' });
    }
  );
};

exports.deleteProduct = (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM products WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ message: 'Product deleted successfully' });
  });
};
