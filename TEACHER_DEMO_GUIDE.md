# Teacher Demonstration Guide
## Retail POS Fraud Detection System

---

## 🎯 Project Overview

A complete Point of Sale (POS) system with real-time fraud detection that automatically flags suspicious transactions.

**Technology Stack:**
- **Backend**: Node.js + Express + SQLite
- **Frontend**: Vanilla JavaScript + Vite
- **Database**: SQLite (dev.db)
- **Authentication**: JWT tokens
- **Security**: Bcrypt password hashing

---

## 📁 Key Files to Show

### Database Files
1. **`backend/dev.db`** - SQLite database (28 KB)
   - Contains all users, products, and transactions
   - Can be opened with DB Browser for SQLite

2. **`backend/database_schema.sql`** - Complete SQL documentation
   - All table structures
   - Sample queries
   - Fraud detection rules

3. **`backend/test_database.js`** - Database verification script
   - Run: `node backend/test_database.js`
   - Shows database contents in terminal

### Backend Code
- **`backend/server.js`** - Main server setup
- **`backend/config/database.js`** - Database initialization
- **`backend/controllers/`** - Business logic
  - `authController.js` - Login/registration
  - `billingController.js` - Transaction processing & fraud detection
  - `productController.js` - Product management
  - `fraudController.js` - Fraud analysis

### Frontend Code
- **`frontend/src/pages/Login.js`** - Login interface
- **`frontend/src/pages/CashierDashboard.js`** - POS system
- **`frontend/src/pages/AdminDashboard.js`** - Admin panel

---

## 🚀 Live Demonstration Steps

### Step 1: Show the Database (2 minutes)

```cmd
cd backend
node test_database.js
```

**What to explain:**
- Database has 2 users (admin, cashier)
- 20+ products with prices in rupees
- All transactions are stored permanently
- Passwords are hashed for security

### Step 2: Open the Application (1 minute)

1. Open browser: http://localhost:5173
2. Show the clean login page (no passwords displayed)

### Step 3: Cashier Demo - Normal Transaction (3 minutes)

1. **Login as Cashier**
   - Username: `cashier`
   - Password: `cashier123`

2. **Create Normal Transaction**
   - Add "Wireless Mouse" (₹599)
   - Add "USB Cable" (₹199)
   - Set discount: 10%
   - Select payment: Card
   - Click Checkout

3. **Result**: ✅ Transaction successful (not flagged)

### Step 4: Cashier Demo - Fraudulent Transaction (3 minutes)

1. **Still logged in as Cashier**
   - Add "Laptop Dell Inspiron" (₹45,999)
   - Set discount: 20% (>15% threshold)
   - Select payment: Card
   - Click Checkout

2. **Result**: 🚨 Transaction flagged!
   - Alert shows warning
   - Displays fraud reasons
   - Transaction still completes but marked for review

### Step 5: Admin Dashboard (3 minutes)

1. **Logout and Login as Admin**
   - Username: `admin`
   - Password: `admin123`

2. **View Flagged Transactions Tab**
   - Shows the 20% discount transaction
   - Displays fraud score (60)
   - Shows discount percentage in red

3. **Manage Products Tab**
   - Click "Manage Products"
   - Show edit functionality
   - Demonstrate adding new product
   - Show delete option

### Step 6: Database Verification (2 minutes)

**Option A: Using DB Browser (Recommended)**
1. Open DB Browser for SQLite
2. Open `backend/dev.db`
3. Browse Data → transactions table
4. Show the flagged transaction (is_flagged = 1)
5. Show discount_percentage column

**Option B: Using Test Script**
```cmd
cd backend
node test_database.js
```

---

## 🎓 Key Features to Highlight

### 1. Real-time Fraud Detection
- **Automatic scoring** based on business rules
- **Multiple factors** considered:
  - Transaction amount
  - Discount percentage
  - Payment method
  - Number of items

### 2. Fraud Detection Rules

| Rule | Threshold | Points | Example |
|------|-----------|--------|---------|
| High Amount | >₹50,000 | +30 | Laptop + Monitor |
| Many Items | >20 items | +20 | Bulk purchase |
| Large Cash | >₹20,000 cash | +25 | Cash payment |
| **Excessive Discount** | **>15%** | **+60** | **20% discount** |

**Flagging Threshold**: Score ≥ 50 points

### 3. Role-Based Access Control
- **Cashier**: Can process sales, apply discounts
- **Admin**: Can view fraud reports, manage products

### 4. Data Persistence
- All transactions stored in SQLite database
- Audit trail for every sale
- Historical data for analysis

### 5. Security Features
- Password hashing (bcrypt)
- JWT authentication
- Protected API endpoints

---

## 📊 Database Schema

### Tables
1. **users** - User accounts (admin, cashier)
2. **products** - Product inventory (20+ items)
3. **transactions** - Sales records with fraud scores
4. **transaction_items** - Individual items per transaction

### Relationships
```
users (1) ──→ (many) transactions
products (1) ──→ (many) transaction_items
transactions (1) ──→ (many) transaction_items
```

---

## 🧪 Test Scenarios

### Scenario 1: Normal Operation ✅
- Product: Mouse (₹599)
- Discount: 10%
- Payment: Card
- **Result**: Not flagged (score: 0)

### Scenario 2: Excessive Discount 🚨
- Product: Keyboard (₹2,499)
- Discount: 20%
- Payment: Card
- **Result**: Flagged (score: 60)

### Scenario 3: High Amount 🚨
- Products: 2x Laptop (₹45,999 each)
- Discount: 0%
- Payment: Card
- **Result**: Flagged (score: 30)

### Scenario 4: Multiple Factors 🚨🚨
- Products: 2x Laptop (₹91,998)
- Discount: 20%
- Payment: Cash
- **Result**: Highly flagged (score: 115)

---

## 💡 Technical Highlights

### Backend Architecture
- RESTful API design
- MVC pattern (Models, Views, Controllers)
- Middleware for authentication
- Error handling

### Frontend Architecture
- Single Page Application (SPA)
- Client-side routing
- JWT token management
- Responsive design

### Database Design
- Normalized schema (3NF)
- Foreign key constraints
- Indexed for performance
- Transaction support

---

## 📝 Questions Teachers Might Ask

**Q: Why SQLite instead of MySQL?**
A: SQLite is perfect for development and demonstration. It's:
- Self-contained (single file)
- Zero configuration
- Easy to share and demonstrate
- Production-ready for small to medium applications

**Q: How is fraud detection implemented?**
A: Rule-based scoring system in `billingController.js`:
- Each suspicious factor adds points
- Score ≥50 flags the transaction
- Configurable thresholds

**Q: Can the system be extended?**
A: Yes! Easy to add:
- More fraud detection rules
- Machine learning models
- Email notifications
- Reporting dashboards
- Multiple store locations

**Q: Is the data secure?**
A: Yes:
- Passwords are hashed (bcrypt)
- JWT tokens for authentication
- SQL injection prevention (parameterized queries)
- CORS protection

**Q: How do you view the database?**
A: Three ways:
1. DB Browser for SQLite (GUI)
2. Command line: `sqlite3 dev.db`
3. Test script: `node test_database.js`

---

## 🎬 Demonstration Checklist

- [ ] Show database file exists (`backend/dev.db`)
- [ ] Run database test script
- [ ] Login as cashier
- [ ] Create normal transaction (not flagged)
- [ ] Create transaction with >15% discount (flagged)
- [ ] Login as admin
- [ ] Show flagged transaction in admin dashboard
- [ ] Demonstrate product management
- [ ] Open database in DB Browser
- [ ] Show transaction records in database
- [ ] Explain fraud detection algorithm

---

## 📞 Support Files

- **README.md** - Project setup and overview
- **HOW_TO_VIEW_DATABASE.md** - Database viewing guide
- **database_schema.sql** - Complete SQL documentation
- **test_database.js** - Database verification script

---

## ✅ Success Criteria

Your demonstration is successful if you can show:

1. ✅ Working login system
2. ✅ Cashier can process transactions
3. ✅ Discounts >15% are automatically flagged
4. ✅ Admin can view flagged transactions
5. ✅ Admin can manage products
6. ✅ All data is stored in dev.db
7. ✅ Database can be opened and viewed

---

**Good luck with your demonstration! 🎉**
