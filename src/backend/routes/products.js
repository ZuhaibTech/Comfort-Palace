const express = require('express');
const Product = require('../models/Product');

const router = express.Router();

// GET /api/products - Get all active products
router.get('/', async (req, res) => {
  const { archived } = req.query;
  
  const query = archived === 'true' ? { is_active: 0 } : { is_active: 1 };
  
  try {
    const products = await Product.find(query).sort({ created_at: -1 });
    
    res.json({
      success: true,
      data: products
    });
  } catch (err) {
    console.error('Failed to fetch products:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch products'
    });
  }
});

// PUT /api/products/:id/restore - Restore archived product
router.put('/:id/restore', async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findByIdAndUpdate(
      id,
      { is_active: 1, archived_at: null },
      { new: true }
    );
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    res.json({
      success: true,
      message: 'Product restored successfully'
    });
  } catch (err) {
    console.error('Failed to restore product:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to restore product'
    });
  }
});

// GET /api/products/:id - Get single product
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (err) {
    console.error('Failed to fetch product:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch product'
    });
  }
});

// POST /api/products - Create new product
router.post('/', async (req, res) => {
  const { 
    item_code, 
    hsn_code,
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

  try {
    const product = new Product({
      item_code, 
      hsn_code: hsn_code || null, 
      name, 
      description: description || null, 
      price, 
      cost_price: cost_price || null, 
      gst_percentage: gst_percentage || null, 
      profit_percentage: profit_percentage || null,
      quantity_in_stock: quantity_in_stock || 0, 
      low_stock_threshold: low_stock_threshold || 10, 
      category: category || null, 
      image_url: image_url || null,
      is_active: 1
    });

    await product.save();

    res.status(201).json({
      success: true,
      data: product,
      message: 'Product created successfully'
    });
  } catch (err) {
    console.error('Product creation error:', err);
    if (err.code === 11000) { // MongoDB duplicate key error
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
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { 
    item_code, 
    hsn_code,
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

  try {
    const product = await Product.findByIdAndUpdate(
      id,
      {
        item_code, hsn_code: hsn_code || null, name, description, price, cost_price, gst_percentage, profit_percentage,
        quantity_in_stock, low_stock_threshold, category, image_url
      },
      { new: true, runValidators: true }
    );
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }
    
    res.json({
      success: true,
      data: product,
      message: 'Product updated successfully'
    });
  } catch (err) {
    console.error('Product update error:', err);
    if (err.code === 11000) {
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
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const now = new Date();

  try {
    const product = await Product.findByIdAndUpdate(
      id,
      { is_active: 0, archived_at: now },
      { new: true }
    );
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    res.json({
      success: true,
      message: 'Product archived successfully'
    });
  } catch (err) {
    console.error('Failed to archive product:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to archive product'
    });
  }
});

module.exports = router;