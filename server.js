const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./backend/config/databases');
const errorHandler = require('./backend/middleware/errorHandler');
const path = require('path');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// CORS Configuration - Allow all origins dynamically for local development
app.use(cors({
  origin: function (origin, callback) {
    callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files for images
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Routes
app.use('/api/auth', require('./backend/routes/authRoutes'));
app.use('/api/products', require('./backend/routes/productRoutes'));
app.use('/api/cart', require('./backend/routes/cartRoutes'));
app.use('/api/orders', require('./backend/routes/orderRoutes'));
app.use('/api/contact', require('./backend/routes/contactRoutes'));

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Virtual Herbal Garden API is running',
    timestamp: new Date().toISOString()
  });
});

// Error handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌿 Virtual Herbal Garden API ready`);
  console.log(`🔗 http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Handle port already in use error
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use!`);
    console.log(`💡 Run this to fix: netstat -ano | findstr :${PORT}`);
    console.log(`   Then: taskkill /PID <PID> /F`);
    process.exit(1);
  }
});