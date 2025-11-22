const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, '..', 'dev.db');
const db = new sqlite3.Database(dbPath);

// Initialize database with tables
const initializeDatabase = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Users table
      db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      // Products table
      db.run(`CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        stock INTEGER NOT NULL,
        category TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      // Transactions table
      db.run(`CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        cashier_id INTEGER NOT NULL,
        total_amount REAL NOT NULL,
        payment_method TEXT NOT NULL,
        discount_percentage REAL DEFAULT 0,
        fraud_score REAL DEFAULT 0,
        is_flagged INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (cashier_id) REFERENCES users(id)
      )`);

      // Transaction items table
      db.run(`CREATE TABLE IF NOT EXISTS transaction_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        transaction_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        price REAL NOT NULL,
        FOREIGN KEY (transaction_id) REFERENCES transactions(id),
        FOREIGN KEY (product_id) REFERENCES products(id)
      )`);

      // Insert default users
      const hashedAdminPass = bcrypt.hashSync('admin123', 10);
      const hashedCashierPass = bcrypt.hashSync('cashier123', 10);

      db.run(`INSERT OR IGNORE INTO users (username, password, role) VALUES (?, ?, ?)`,
        ['admin', hashedAdminPass, 'admin']);
      
      db.run(`INSERT OR IGNORE INTO users (username, password, role) VALUES (?, ?, ?)`,
        ['cashier', hashedCashierPass, 'cashier']);

      // Insert sample products (prices in rupees)
      const products = [
        ['Laptop Dell Inspiron', 45999, 10, 'Electronics'],
        ['Laptop HP Pavilion', 52999, 8, 'Electronics'],
        ['Wireless Mouse', 599, 50, 'Electronics'],
        ['Gaming Mouse', 1299, 30, 'Electronics'],
        ['Mechanical Keyboard', 2499, 25, 'Electronics'],
        ['Wireless Keyboard', 899, 40, 'Electronics'],
        ['LED Monitor 24"', 12999, 15, 'Electronics'],
        ['LED Monitor 27"', 18999, 10, 'Electronics'],
        ['USB Cable Type-C', 199, 100, 'Accessories'],
        ['HDMI Cable', 299, 80, 'Accessories'],
        ['Webcam HD', 1899, 20, 'Electronics'],
        ['Headphones', 1499, 35, 'Electronics'],
        ['USB Flash Drive 32GB', 499, 60, 'Accessories'],
        ['External Hard Drive 1TB', 3999, 15, 'Accessories'],
        ['Laptop Bag', 799, 45, 'Accessories'],
        ['Phone Charger', 399, 70, 'Accessories'],
        ['Power Bank 10000mAh', 1199, 40, 'Electronics'],
        ['Bluetooth Speaker', 2299, 25, 'Electronics'],
        ['Smartphone Samsung', 15999, 12, 'Electronics'],
        ['Smartphone Xiaomi', 12999, 18, 'Electronics']
      ];

      const stmt = db.prepare(`INSERT OR IGNORE INTO products (name, price, stock, category) VALUES (?, ?, ?, ?)`);
      products.forEach(product => stmt.run(product));
      stmt.finalize();

      console.log('Database initialized successfully!');
      resolve();
    });
  });
};

module.exports = { db, initializeDatabase };
