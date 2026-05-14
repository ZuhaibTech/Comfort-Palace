const initSqlJs = require('sql.js');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, 'database.sqlite');
let db;

// Initialize SQL.js database
const initDB = async () => {
  const SQL = await initSqlJs();
  try {
    const filebuffer = fs.readFileSync(dbPath);
    db = new SQL.Database(filebuffer);
  } catch (err) {
    // If database doesn't exist, create a new one
    db = new SQL.Database();
  }
  return db;
};

// Initialize database tables
const initDatabase = async () => {
  try {
    await initDB();
    
    // Create products table
    db.run(`
      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        item_code TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        price REAL NOT NULL,
        cost_price REAL,
        gst_percentage REAL,
        profit_percentage REAL,
        quantity_in_stock INTEGER NOT NULL DEFAULT 0,
        low_stock_threshold INTEGER DEFAULT 10,
        category TEXT,
        image_url TEXT,
        is_active INTEGER DEFAULT 1,
        archived_at DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Add new columns if they don't exist (for existing databases)
    try {
      db.run(`ALTER TABLE products ADD COLUMN gst_percentage REAL`);
    } catch (err) {
      // Column already exists, ignore error
    }
    
    try {
      db.run(`ALTER TABLE products ADD COLUMN profit_percentage REAL`);
    } catch (err) {
      // Column already exists, ignore error
    }

    // Create sales table
    db.run(`
      CREATE TABLE IF NOT EXISTS sales (
        id TEXT PRIMARY KEY,
        sale_number TEXT UNIQUE NOT NULL,
        customer_name TEXT,
        customer_email TEXT,
        customer_phone TEXT,
        customer_address TEXT,
        total_amount REAL NOT NULL,
        tax_amount REAL DEFAULT 0,
        discount_amount REAL DEFAULT 0,
        amount_paid REAL DEFAULT 0,
        payment_method TEXT,
        payment_status TEXT DEFAULT 'pending',
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Attempt to migrate legacy databases by adding missing columns
    try {
      db.run(`ALTER TABLE sales ADD COLUMN amount_paid REAL DEFAULT 0`);
    } catch (_) {
      // ignore if column already exists
    }

    // Create sale_items table
    db.run(`
      CREATE TABLE IF NOT EXISTS sale_items (
        id TEXT PRIMARY KEY,
        sale_id TEXT NOT NULL,
        product_id TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        unit_price REAL NOT NULL,
        total_price REAL NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (sale_id) REFERENCES sales (id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE RESTRICT
      )
    `);

    // Create contact_forms table
    db.run(`
      CREATE TABLE IF NOT EXISTS contact_forms (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        phone TEXT NOT NULL,
        email TEXT NOT NULL,
        requirement TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create testimonials table
    db.run(`
      CREATE TABLE IF NOT EXISTS testimonials (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
        description TEXT NOT NULL,
        status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'rejected')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Save the database to file
    saveDatabase();
    
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
};

// Save database to file
const saveDatabase = () => {
  if (db) {
    const data = db.export();
    fs.writeFileSync(dbPath, data);
  }
};

// Helper function to generate sale number
const generateSaleNumber = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const time = String(now.getTime()).slice(-6);
  return `SALE-${year}${month}${day}-${time}`;
};

module.exports = {
  getDb: () => db,
  initDatabase,
  generateSaleNumber,
  saveDatabase
};