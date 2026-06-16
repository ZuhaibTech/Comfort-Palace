const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./db');
const Product = require('./models/Product');

// Import routes
const productsRouter = require('./routes/products');
const salesRouter = require('./routes/sales');
const uploadRouter = require('./routes/upload');
const authRouter = require('./routes/auth');
const contactRouter = require('./routes/contact');
const testimonialsRouter = require('./routes/testimonials');

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize database before starting server
const startServer = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await connectDB();
    console.log('Database connected successfully');

    // Middleware
    app.use(cors());
    app.use(express.json({ limit: '50mb' }));
    app.use(express.urlencoded({ extended: true, limit: '50mb' }));

    // Serve uploaded files statically from the public directory
    app.use('/uploads', express.static(path.join(__dirname, '../../public/uploads')));

    // Routes
    app.use('/api/products', productsRouter);
    app.use('/api/sales', salesRouter);
    app.use('/api/upload', uploadRouter);
    app.use('/api/auth', authRouter);
    app.use('/api/contact', contactRouter);
    app.use('/api/testimonials', testimonialsRouter);

    // Health check endpoint
    app.get('/api/health', (req, res) => {
      res.json({
        success: true,
        message: 'Comfort Palace API is running',
        timestamp: new Date().toISOString()
      });
    });

    // Debug endpoint to test frontend connectivity
    app.get('/api/debug', (req, res) => {
      res.json({
        success: true,
        message: 'Frontend can reach backend',
        origin: req.headers.origin,
        userAgent: req.headers['user-agent'],
        timestamp: new Date().toISOString()
      });
    });

    // Error handling middleware
    app.use((err, req, res, next) => {
      console.error('Error:', err);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    });

    // 404 handler
    app.use((req, res) => {
      res.status(404).json({
        success: false,
        error: 'Route not found'
      });
    });

    // Scheduled cleanup function for old archived products
    const runCleanup = async () => {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      try {
        const result = await Product.deleteMany({
          is_active: 0,
          archived_at: { $lt: thirtyDaysAgo }
        });

        if (result.deletedCount === 0) {
          console.log('Cleanup: No products eligible for permanent deletion');
          return;
        }

        console.log(`Cleanup: Permanently deleted ${result.deletedCount} archived products older than 30 days`);
      } catch (err) {
        console.error('Cleanup error:', err);
      }
    };

    // Schedule cleanup to run daily at 2 AM
    const scheduleCleanup = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(2, 0, 0, 0); // 2 AM
      
      const msUntilTomorrow = tomorrow.getTime() - now.getTime();
      
      // Run cleanup after the delay, then every 24 hours
      setTimeout(() => {
        runCleanup();
        setInterval(runCleanup, 24 * 60 * 60 * 1000); // 24 hours
      }, msUntilTomorrow);
      
      console.log(`Cleanup scheduled for ${tomorrow.toLocaleString()}`);
    };
    
    // Schedule automatic cleanup
    scheduleCleanup();
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`API Base URL: http://localhost:${PORT}/api`);
      console.log(`Health Check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
