const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { getDb, saveDatabase } = require('../database');

const router = express.Router();

// GET /api/products - Get all active products
router.get('/', (req, res) => {
  const { archived } = req.query;
  const db = getDb();
  
  let sql = 'SELECT * FROM products WHERE is_active = 1 ORDER BY created_at DESC';
  
  if (archived === 'true') {
    sql = 'SELECT * FROM products WHERE is_active = 0 ORDER BY created_at DESC';
  }
  
  try {
    const rows = db.exec(sql);
    const data = rows[0] ? rows[0].values.map(row => {
      const obj = {};
      rows[0].columns.forEach((col, index) => {
        obj[col] = row[index];
      });
      return obj;
    }) : [];
    
    res.json({
      success: true,
      data: data
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch products'
    });
  }
});

// PUT /api/products/:id/restore - Restore archived product
router.put('/:id/restore', (req, res) => {
  const { id } = req.params;
  const db = getDb();

  try {
    const stmt = db.prepare('UPDATE products SET is_active = 1, archived_at = NULL, updated_at = ? WHERE id = ?');
    const result = stmt.run([new Date().toISOString(), id]);
    stmt.free();
    
    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    saveDatabase();
    res.json({
      success: true,
      message: 'Product restored successfully'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Failed to restore product'
    });
  }
});

// GET /api/products/:id - Get single product
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const db = getDb();

  try {
    const rows = db.exec('SELECT * FROM products WHERE id = ?', [id]);
    const data = rows[0] ? rows[0].values.map(row => {
      const obj = {};
      rows[0].columns.forEach((col, index) => {
        obj[col] = row[index];
      });
      return obj;
    }) : [];

    if (data.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: data[0]
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch product'
    });
  }
});

// POST /api/products - Create new product
router.post('/', (req, res) => {
  const { 
    item_code, 
    name, 
    description, 
    price, 
    cost_price, 
    gst_percentage,
    profit_percentage,
    quantity_in_stock, 
    low_stock_threshold, 
    category, 
    image_url 
  } = req.body;

  if (!item_code || !name || !price) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields: item_code, name, price'
    });
  }

  const db = getDb();
  const id = uuidv4();
  const now = new Date().toISOString();

  try {
    const stmt = db.prepare(`
      INSERT INTO products (
        id, item_code, name, description, price, cost_price, gst_percentage, profit_percentage,
        quantity_in_stock, low_stock_threshold, category, image_url,
        is_active, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run([
      id, item_code, name, description || null, price, cost_price || null, gst_percentage || null, profit_percentage || null,
      quantity_in_stock || 0, low_stock_threshold || 10, category || null, image_url || null,
      1, now, now
    ]);
    
    stmt.free();
    saveDatabase();

    res.status(201).json({
      success: true,
      data: { id, item_code, name, description, price, cost_price, gst_percentage, profit_percentage, quantity_in_stock, low_stock_threshold, category, image_url, is_active: 1, created_at: now, updated_at: now },
      message: 'Product created successfully'
    });
  } catch (err) {
    console.error('Product creation error:', err);
    if (err.message && err.message.includes('UNIQUE constraint failed')) {
      return res.status(400).json({
        success: false,
        error: 'Product with this item code already exists'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to create product'
    });
  }
});

// PUT /api/products/:id - Update product
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { 
    item_code, 
    name, 
    description, 
    price, 
    cost_price, 
    gst_percentage,
    profit_percentage,
    quantity_in_stock, 
    low_stock_threshold, 
    category, 
    image_url 
  } = req.body;

  const db = getDb();
  const now = new Date().toISOString();

  try {
    const stmt = db.prepare(`
      UPDATE products SET 
        item_code = ?, name = ?, description = ?, price = ?, cost_price = ?, gst_percentage = ?, profit_percentage = ?,
        quantity_in_stock = ?, low_stock_threshold = ?, category = ?, image_url = ?,
        updated_at = ?
      WHERE id = ?
    `);
    
    const result = stmt.run([
      item_code, name, description, price, cost_price, gst_percentage, profit_percentage,
      quantity_in_stock, low_stock_threshold, category, image_url,
      now, id
    ]);
    
    stmt.free();
    
    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    saveDatabase();
    
    // Get the updated product data
    const selectStmt = db.prepare('SELECT * FROM products WHERE id = ?');
    const product = selectStmt.getAsObject([id]);
    selectStmt.free();
    
    res.json({
      success: true,
      data: product,
      message: 'Product updated successfully'
    });
  } catch (err) {
    console.error('Product update error:', err);
    console.error('Update data:', { item_code, name, price, cost_price, gst_percentage, profit_percentage, quantity_in_stock, low_stock_threshold });
    if (err.message && err.message.includes('UNIQUE constraint failed')) {
      return res.status(400).json({
        success: false,
        error: 'Product with this item code already exists'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to update product'
    });
  }
});

// DELETE /api/products/:id - Archive product (soft delete)
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const db = getDb();
  const now = new Date().toISOString();

  try {
    const stmt = db.prepare('UPDATE products SET is_active = 0, archived_at = ?, updated_at = ? WHERE id = ?');
    const result = stmt.run([now, now, id]);
    stmt.free();
    
    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    saveDatabase();
    res.json({
      success: true,
      message: 'Product archived successfully'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Failed to archive product'
    });
  }
});

module.exports = router;