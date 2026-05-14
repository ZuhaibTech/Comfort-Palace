const express = require('express');
const cors = require('cors');
const path = require('path');
const { initDatabase, getDb, saveDatabase } = require('./database');

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
    console.log('Initializing database...');
    await initDatabase();
    console.log('Database initialized successfully');

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
    message: 'Inventory Artisans API is running',
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
const runCleanup = () => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const cutoffDate = thirtyDaysAgo.toISOString();

  try {
    const db = getDb();
    
    // Get products to delete
    const stmt = db.prepare('SELECT id, name, item_code FROM products WHERE is_active = 0 AND archived_at < ?');
    const rows = [];
    
    // Execute query and collect results
    while (stmt.step()) {
      const row = stmt.getAsObject();
      rows.push(row);
    }
    stmt.free();

    if (rows.length === 0) {
      console.log('Cleanup: No products eligible for permanent deletion');
      return;
    }

    const productIds = rows.map(row => row.id);
    const placeholders = productIds.map(() => '?').join(',');
    
    // Delete products
    const deleteStmt = db.prepare(`DELETE FROM products WHERE id IN (${placeholders})`);
    const deleteResult = deleteStmt.run(productIds);
    deleteStmt.free();

    saveDatabase();

    console.log(`Cleanup: Permanently deleted ${deleteResult.changes} archived products older than 30 days`);
    if (rows.length > 0) {
      console.log('Deleted products:', rows.map(row => `${row.name} (${row.item_code})`).join(', '));
    }
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
