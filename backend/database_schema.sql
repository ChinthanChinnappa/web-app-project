-- ============================================
-- RETAIL POS FRAUD DETECTION SYSTEM
-- Database Schema (SQLite)
-- ============================================

-- This file documents all SQL commands used in dev.db
-- Database Location: backend/dev.db

-- ============================================
-- TABLE: users
-- Stores user accounts (admin and cashier)
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,           -- Hashed with bcrypt
  role TEXT NOT NULL,                -- 'admin' or 'cashier'
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Sample Data: Default Users
-- Admin: username='admin', password='admin123' (hashed)
-- Cashier: username='cashier', password='cashier123' (hashed)

-- ============================================
-- TABLE: products
-- Stores product inventory
-- ============================================
CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  price REAL NOT NULL,               -- Price in Indian Rupees (₹)
  stock INTEGER NOT NULL,
  category TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Sample Data: 20 Products
-- Examples:
-- - Laptop Dell Inspiron: ₹45,999
-- - Wireless Mouse: ₹599
-- - Smartphone Samsung: ₹15,999
-- (See full list in config/database.js)

-- ============================================
-- TABLE: transactions
-- Stores all sales transactions
-- ============================================
CREATE TABLE IF NOT EXISTS transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  cashier_id INTEGER NOT NULL,
  total_amount REAL NOT NULL,        -- Final amount after discount
  payment_method TEXT NOT NULL,      -- 'card', 'cash', or 'upi'
  discount_percentage REAL DEFAULT 0, -- Discount applied (0-100)
  fraud_score REAL DEFAULT 0,        -- Calculated fraud risk score
  is_flagged INTEGER DEFAULT 0,      -- 1 if flagged, 0 if normal
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (cashier_id) REFERENCES users(id)
);

-- Fraud Detection Rules:
-- - High amount (>₹50,000): +30 points
-- - Many items (>20): +20 points
-- - Large cash payment (>₹20,000): +25 points
-- - Excessive discount (>15%): +60 points
-- - Score ≥50: Transaction is flagged

-- ============================================
-- TABLE: transaction_items
-- Stores individual items in each transaction
-- ============================================
CREATE TABLE IF NOT EXISTS transaction_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  transaction_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL,
  price REAL NOT NULL,               -- Price at time of sale
  FOREIGN KEY (transaction_id) REFERENCES transactions(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- ============================================
-- COMMON QUERIES
-- ============================================

-- Get all flagged transactions with cashier names
SELECT t.*, u.username as cashier_name 
FROM transactions t 
JOIN users u ON t.cashier_id = u.id 
WHERE t.is_flagged = 1 
ORDER BY t.created_at DESC;

-- Get all products
SELECT * FROM products ORDER BY name;

-- Get transaction details with items
SELECT t.*, u.username as cashier_name,
       ti.product_id, ti.quantity, ti.price, p.name as product_name
FROM transactions t
JOIN users u ON t.cashier_id = u.id
JOIN transaction_items ti ON t.id = ti.transaction_id
JOIN products p ON ti.product_id = p.id
WHERE t.id = ?;

-- Get all transactions by a specific cashier
SELECT * FROM transactions 
WHERE cashier_id = ? 
ORDER BY created_at DESC;

-- Get products by category
SELECT * FROM products 
WHERE category = ? 
ORDER BY name;

-- Update product price
UPDATE products 
SET price = ?, stock = ? 
WHERE id = ?;

-- Get fraud statistics
SELECT 
  COUNT(*) as total_transactions,
  SUM(CASE WHEN is_flagged = 1 THEN 1 ELSE 0 END) as flagged_count,
  AVG(fraud_score) as avg_fraud_score,
  SUM(total_amount) as total_revenue
FROM transactions;

-- Get top selling products
SELECT p.name, p.category, 
       SUM(ti.quantity) as total_sold,
       SUM(ti.quantity * ti.price) as revenue
FROM transaction_items ti
JOIN products p ON ti.product_id = p.id
GROUP BY p.id
ORDER BY total_sold DESC
LIMIT 10;

-- ============================================
-- INDEXES (for better performance)
-- ============================================
CREATE INDEX IF NOT EXISTS idx_transactions_cashier ON transactions(cashier_id);
CREATE INDEX IF NOT EXISTS idx_transactions_flagged ON transactions(is_flagged);
CREATE INDEX IF NOT EXISTS idx_transaction_items_transaction ON transaction_items(transaction_id);
CREATE INDEX IF NOT EXISTS idx_transaction_items_product ON transaction_items(product_id);

-- ============================================
-- HOW TO VIEW THE DATABASE
-- ============================================
-- 1. Install SQLite Browser: https://sqlitebrowser.org/
-- 2. Open backend/dev.db
-- 3. Browse tables and run queries
--
-- OR use command line:
-- sqlite3 backend/dev.db
-- .tables
-- .schema users
-- SELECT * FROM products;
