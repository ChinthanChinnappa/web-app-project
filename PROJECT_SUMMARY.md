# Retail POS Fraud Detection System - Project Summary

## 🎓 Academic Project
**Course**: Web Application Development  
**Technology**: Full Stack JavaScript (Node.js + Vanilla JS)  
**Database**: SQLite (dev.db)

---

## 📋 Project Overview

A complete Point of Sale (POS) system with real-time fraud detection capabilities. The system automatically flags suspicious transactions based on configurable business rules and provides separate dashboards for cashiers and administrators.

---

## 🏗️ Architecture

### Backend (Node.js + Express)
- RESTful API architecture
- SQLite database for data persistence
- JWT-based authentication
- Bcrypt password hashing
- Real-time fraud detection algorithm

### Frontend (Vanilla JavaScript + Vite)
- Single Page Application (SPA)
- Client-side routing
- Responsive design
- Real-time updates

### Database (SQLite)
- 4 normalized tables
- Foreign key constraints
- Transaction support
- 28 KB database file

---

## ✨ Key Features

### 1. User Authentication
- Role-based access control (Admin/Cashier)
- Secure password hashing
- JWT token management
- Session persistence

### 2. Cashier Dashboard
- Product catalog with search
- Shopping cart functionality
- Discount application (0-100%)
- Multiple payment methods (Card/Cash/UPI)
- Real-time fraud warnings

### 3. Admin Dashboard
- View flagged transactions
- Product management (CRUD operations)
- Update prices and inventory
- Fraud analytics

### 4. Fraud Detection System
**Automatic scoring based on:**
- Transaction amount (>₹50,000 = +30 points)
- Number of items (>20 items = +20 points)
- Large cash payments (>₹20,000 = +25 points)
- **Excessive discounts (>15% = +60 points)**

**Flagging threshold**: Score ≥ 50 points

---

## 📊 Database Schema

### Tables
1. **users** - User accounts with roles
2. **products** - Product inventory (20+ items)
3. **transactions** - Sales records with fraud scores
4. **transaction_items** - Line items for each transaction

### Sample Data
- 2 users (admin, cashier)
- 20 products with Indian Rupee pricing
- All transactions stored permanently

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Git

### Quick Start

```bash
# Clone the repository
git clone https://github.com/ChinthanChinnappa/web-app-project.git
cd web-app-project

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Start backend server (Terminal 1)
cd backend
npm start
# Server runs on http://localhost:3000

# Start frontend dev server (Terminal 2)
cd frontend
npm run dev
# Frontend runs on http://localhost:5173
```

### Default Credentials

**Admin Account**
- Username: `admin`
- Password: `admin123`

**Cashier Account**
- Username: `cashier`
- Password: `cashier123`

---

## 📁 Project Structure

```
web-app-project/
├── backend/
│   ├── config/
│   │   └── database.js          # Database setup & initialization
│   ├── controllers/
│   │   ├── authController.js    # Login/registration logic
│   │   ├── billingController.js # Transaction & fraud detection
│   │   ├── productController.js # Product CRUD operations
│   │   └── fraudController.js   # Fraud analysis
│   ├── middleware/
│   │   └── auth.js              # JWT authentication
│   ├── routes/
│   │   ├── auth.js              # Auth endpoints
│   │   ├── billing.js           # Transaction endpoints
│   │   ├── products.js          # Product endpoints
│   │   └── fraud.js             # Fraud endpoints
│   ├── dev.db                   # SQLite database file
│   ├── database_schema.sql      # SQL documentation
│   ├── test_database.js         # Database verification script
│   ├── server.js                # Express server
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.js         # Login page
│   │   │   ├── CashierDashboard.js  # POS interface
│   │   │   └── AdminDashboard.js    # Admin panel
│   │   ├── utils/
│   │   │   ├── Auth.js          # Authentication utilities
│   │   │   └── Router.js        # Client-side routing
│   │   ├── styles/
│   │   │   └── style.css        # Application styles
│   │   ├── App.js               # Main app component
│   │   └── main.js              # Entry point
│   ├── index.html
│   └── package.json
│
├── README.md                    # Setup instructions
├── QUICK_REFERENCE.md           # Quick reference card
├── TEACHER_DEMO_GUIDE.md        # Demonstration guide
├── HOW_TO_VIEW_DATABASE.md      # Database viewing guide
└── .gitignore
```

---

## 🧪 Testing the Application

### Test Case 1: Normal Transaction
1. Login as cashier
2. Add products (total < ₹50,000)
3. Apply discount ≤ 15%
4. Complete transaction
5. **Result**: ✅ Not flagged

### Test Case 2: Excessive Discount (Fraud)
1. Login as cashier
2. Add any product
3. Apply discount > 15% (e.g., 20%)
4. Complete transaction
5. **Result**: 🚨 Flagged for review

### Test Case 3: View Flagged Transactions
1. Logout and login as admin
2. Navigate to "Flagged Transactions" tab
3. See the transaction with excessive discount
4. View fraud score and reasons

---

## 📸 Screenshots

### Login Page
- Clean interface without password display
- Demo credentials removed for security

### Cashier Dashboard
- Product grid with prices in rupees
- Shopping cart with discount input
- Payment method selection
- Real-time total calculation

### Admin Dashboard
- Flagged transactions table
- Product management interface
- Edit/delete functionality
- Add new products

---

## 🔒 Security Features

1. **Password Security**
   - Bcrypt hashing (10 rounds)
   - No plain text storage

2. **API Security**
   - JWT token authentication
   - Protected endpoints
   - Token expiration (24 hours)

3. **SQL Injection Prevention**
   - Parameterized queries
   - Input validation

4. **CORS Protection**
   - Configured for localhost development
   - Can be restricted for production

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `README.md` | Setup and installation guide |
| `QUICK_REFERENCE.md` | Quick lookup for credentials and commands |
| `TEACHER_DEMO_GUIDE.md` | Complete demonstration script |
| `HOW_TO_VIEW_DATABASE.md` | Guide for viewing dev.db |
| `backend/database_schema.sql` | Complete SQL documentation |
| `backend/test_database.js` | Database verification script |

---

## 🛠️ Technologies Used

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **SQLite3** - Database
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variables

### Frontend
- **Vanilla JavaScript** - No framework
- **Vite** - Build tool and dev server
- **Axios** - HTTP client
- **CSS3** - Styling

---

## 📊 Database Statistics

- **Size**: 28 KB
- **Tables**: 4
- **Products**: 20+
- **Users**: 2 (admin, cashier)
- **Transactions**: Stored permanently

### View Database
```bash
# Using test script
cd backend
node test_database.js

# Using DB Browser for SQLite
# Download from: https://sqlitebrowser.org/
# Open: backend/dev.db
```

---

## 🎯 Learning Outcomes

This project demonstrates:
1. ✅ Full stack web development
2. ✅ RESTful API design
3. ✅ Database design and normalization
4. ✅ Authentication and authorization
5. ✅ Client-side routing
6. ✅ Real-time fraud detection algorithms
7. ✅ CRUD operations
8. ✅ Security best practices

---

## 🚀 Future Enhancements

Potential improvements:
- Machine learning-based fraud detection
- Email notifications for flagged transactions
- Multi-store support
- Sales analytics dashboard
- Export reports (PDF/Excel)
- Barcode scanner integration
- Receipt printing
- Customer management

---

## 📝 License

This is an academic project for educational purposes.

---

## 👨‍💻 Author

**Chinthan Chinnappa**  
GitHub: [@ChinthanChinnappa](https://github.com/ChinthanChinnappa)

---

## 🙏 Acknowledgments

- Course instructor and teaching assistants
- SQLite for the excellent embedded database
- Express.js community
- Vite for the fast build tool

---

## 📞 Support

For questions or issues:
1. Check the documentation files
2. Review the code comments
3. Test using the provided test cases
4. Verify database using test_database.js

---

**Repository**: https://github.com/ChinthanChinnappa/web-app-project

**Last Updated**: November 22, 2025
