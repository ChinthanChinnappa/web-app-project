// Quick script to verify database contents
// Run with: node test_database.js

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'dev.db');
const db = new sqlite3.Database(dbPath);

console.log('='.repeat(60));
console.log('DATABASE VERIFICATION TEST');
console.log('='.repeat(60));
console.log(`Database: ${dbPath}\n`);

// Test 1: Check users
db.all('SELECT id, username, role FROM users', [], (err, users) => {
  if (err) {
    console.error('❌ Error reading users:', err);
    return;
  }
  console.log('✅ USERS TABLE:');
  console.table(users);
});

// Test 2: Check products count
db.get('SELECT COUNT(*) as count FROM products', [], (err, result) => {
  if (err) {
    console.error('❌ Error counting products:', err);
    return;
  }
  console.log(`✅ PRODUCTS: ${result.count} products in database\n`);
});

// Test 3: Show sample products
db.all('SELECT id, name, price, stock, category FROM products LIMIT 5', [], (err, products) => {
  if (err) {
    console.error('❌ Error reading products:', err);
    return;
  }
  console.log('📦 SAMPLE PRODUCTS:');
  console.table(products);
});

// Test 4: Check transactions
db.get('SELECT COUNT(*) as count FROM transactions', [], (err, result) => {
  if (err) {
    console.error('❌ Error counting transactions:', err);
    return;
  }
  console.log(`✅ TRANSACTIONS: ${result.count} transactions recorded\n`);
});

// Test 5: Show flagged transactions
db.all(`
  SELECT t.id, u.username as cashier, t.total_amount, t.discount_percentage, 
         t.fraud_score, t.is_flagged, t.created_at
  FROM transactions t
  JOIN users u ON t.cashier_id = u.id
  WHERE t.is_flagged = 1
  ORDER BY t.created_at DESC
  LIMIT 5
`, [], (err, flagged) => {
  if (err) {
    console.error('❌ Error reading flagged transactions:', err);
    return;
  }
  
  if (flagged.length > 0) {
    console.log('🚨 FLAGGED TRANSACTIONS:');
    console.table(flagged);
  } else {
    console.log('✅ No flagged transactions yet (create one with >15% discount)\n');
  }
  
  console.log('='.repeat(60));
  console.log('Database verification complete!');
  console.log('To view full database, use DB Browser for SQLite');
  console.log('Download: https://sqlitebrowser.org/');
  console.log('='.repeat(60));
  
  db.close();
});
