const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { initializeDatabase } = require('./config/database');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const billingRoutes = require('./routes/billing');
const fraudRoutes = require('./routes/fraud');

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/fraud', fraudRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

const PORT = process.env.PORT || 3000;

// Initialize database and start server
initializeDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log('Database initialized with sample data');
      console.log('Default users:');
      console.log('  Admin - username: admin, password: admin123');
      console.log('  Cashier - username: cashier, password: cashier123');
    });
  })
  .catch(err => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  });
