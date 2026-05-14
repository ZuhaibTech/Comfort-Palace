const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { getDb, generateSaleNumber, saveDatabase } = require('../database');

const router = express.Router();

// GET /api/sales - Get all sales with items
router.get('/', (req, res) => {
  const db = getDb();
  
  try {
    // Get all sales
    const salesRows = db.exec('SELECT * FROM sales ORDER BY created_at DESC');
    const sales = salesRows[0] ? salesRows[0].values.map(row => {
      const obj = {};
      salesRows[0].columns.forEach((col, index) => {
        obj[col] = row[index];
      });
      return obj;
    }) : [];

    // Get all sale items with product info
    const itemsRows = db.exec(`
      SELECT si.*, p.name as product_name, p.item_code as product_item_code
      FROM sale_items si
      LEFT JOIN products p ON si.product_id = p.id
      ORDER BY si.created_at
    `);
    const items = itemsRows[0] ? itemsRows[0].values.map(row => {
      const obj = {};
      itemsRows[0].columns.forEach((col, index) => {
        obj[col] = row[index];
      });
      return obj;
    }) : [];

    // Group items by sale_id
    const salesWithItems = sales.map(sale => {
      const saleItems = items.filter(item => item.sale_id === sale.id);
      const recalculatedTotal = saleItems.reduce((sum, item) => {
        const unitPrice = Number(item.unit_price) || 0;
        const quantity = Number(item.quantity) || 0;
        const totalPrice = Number(item.total_price);
        if (!Number.isNaN(totalPrice) && totalPrice > 0) {
          return sum + totalPrice;
        }
        return sum + unitPrice * quantity;
      }, 0);

      const rawTotal = Number(sale.total_amount);
      const normalizedTotal = (!Number.isNaN(rawTotal) && rawTotal > 0) ? rawTotal : recalculatedTotal;
      const normalizedAmountPaid = Number(sale.amount_paid) || 0;
      const normalizedStatus = normalizedAmountPaid >= normalizedTotal && normalizedTotal > 0
        ? 'completed'
        : (sale.payment_status || 'pending');

      return {
        ...sale,
        total_amount: normalizedTotal,
        amount_paid: normalizedAmountPaid,
        payment_status: normalizedStatus,
        sale_items: saleItems
      };
    });

    res.json({
      success: true,
      data: salesWithItems
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch sales'
    });
  }
});

// GET /api/sales/:id - Get single sale with items
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const db = getDb();

  try {
    // Get sale
    const salesRows = db.exec('SELECT * FROM sales WHERE id = ?', [id]);
    const sales = salesRows[0] ? salesRows[0].values.map(row => {
      const obj = {};
      salesRows[0].columns.forEach((col, index) => {
        obj[col] = row[index];
      });
      return obj;
    }) : [];

    if (sales.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Sale not found'
      });
    }

    const sale = sales[0];

    // Get sale items
    const itemsRows = db.exec(`
      SELECT si.*, p.name as product_name, p.item_code as product_item_code
      FROM sale_items si
      LEFT JOIN products p ON si.product_id = p.id
      WHERE si.sale_id = ?
      ORDER BY si.created_at
    `, [id]);
    
    const saleItems = itemsRows[0] ? itemsRows[0].values.map(row => {
      const obj = {};
      itemsRows[0].columns.forEach((col, index) => {
        obj[col] = row[index];
      });
      return obj;
    }) : [];

    const recalculatedTotal = saleItems.reduce((sum, item) => {
      const unitPrice = Number(item.unit_price) || 0;
      const quantity = Number(item.quantity) || 0;
      const totalPrice = Number(item.total_price);
      if (!Number.isNaN(totalPrice) && totalPrice > 0) {
        return sum + totalPrice;
      }
      return sum + unitPrice * quantity;
    }, 0);

    const rawTotal = Number(sale.total_amount);
    const normalizedTotal = (!Number.isNaN(rawTotal) && rawTotal > 0) ? rawTotal : recalculatedTotal;
    const normalizedAmountPaid = Number(sale.amount_paid) || 0;
    const normalizedStatus = normalizedAmountPaid >= normalizedTotal && normalizedTotal > 0
      ? 'completed'
      : (sale.payment_status || 'pending');

    res.json({
      success: true,
      data: {
        ...sale,
        total_amount: normalizedTotal,
        amount_paid: normalizedAmountPaid,
        payment_status: normalizedStatus,
        sale_items: saleItems
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch sale'
    });
  }
});

// POST /api/sales - Create new sale
router.post('/', (req, res) => {
  try {
    const {
      customer_name,
      customer_email,
      customer_phone,
      customer_address,
      total_amount,
      tax_amount,
      discount_amount,
      amount_paid,
      payment_method,
      payment_status,
      notes,
      sale_items
    } = req.body;

    // Validate and sanitize all inputs
    if (!sale_items || !Array.isArray(sale_items) || sale_items.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Sale items are required and must be an array'
      });
    }

    // Validate total_amount
    if (typeof total_amount !== 'number' || total_amount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Total amount must be a positive number'
      });
    }

    // Sanitize all string inputs
    const sanitizedData = {
      customer_name: customer_name ? String(customer_name).trim() : null,
      customer_email: customer_email ? String(customer_email).trim() : null,
      customer_phone: customer_phone ? String(customer_phone).trim() : null,
      customer_address: customer_address ? String(customer_address).trim() : null,
      total_amount: Number(total_amount),
      tax_amount: tax_amount ? Number(tax_amount) : 0,
      discount_amount: discount_amount ? Number(discount_amount) : 0,
      amount_paid: amount_paid ? Number(amount_paid) : 0,
      payment_method: payment_method ? String(payment_method).trim() : 'cash',
      payment_status: payment_status ? String(payment_status).trim() : undefined,
      notes: notes ? String(notes).trim() : null,
      sale_items: sale_items.map(item => ({
        product_id: String(item.product_id),
        quantity: Number(item.quantity),
        unit_price: Number(item.unit_price),
        total_price: Number(item.total_price)
      }))
    };

    // Auto-derive payment status by amount paid
    if (!sanitizedData.payment_status) {
      sanitizedData.payment_status = sanitizedData.amount_paid >= sanitizedData.total_amount ? 'completed' : 'pending';
    }

    const db = getDb();
    const saleId = uuidv4();
    const saleNumber = generateSaleNumber();
    const now = new Date().toISOString();

    // Create sale
    const saleStmt = db.prepare(`
      INSERT INTO sales (
        id, sale_number, customer_name, customer_email, customer_phone, customer_address,
        total_amount, tax_amount, discount_amount, amount_paid, payment_method, payment_status, notes,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    saleStmt.run([
      saleId, saleNumber, sanitizedData.customer_name, sanitizedData.customer_email, sanitizedData.customer_phone, sanitizedData.customer_address,
      sanitizedData.total_amount, sanitizedData.tax_amount, sanitizedData.discount_amount, sanitizedData.amount_paid, sanitizedData.payment_method, sanitizedData.payment_status, sanitizedData.notes,
      now, now
    ]);
    saleStmt.free();

    // Create sale items
    const itemStmt = db.prepare(`
      INSERT INTO sale_items (
        id, sale_id, product_id, quantity, unit_price, total_price, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    for (const item of sanitizedData.sale_items) {
      const itemId = uuidv4();
      itemStmt.run([
        itemId, saleId, item.product_id, item.quantity, item.unit_price, item.total_price, now
      ]);
    }
    itemStmt.free();

    // Update product stock
    const updateStockStmt = db.prepare('UPDATE products SET quantity_in_stock = quantity_in_stock - ?, updated_at = ? WHERE id = ?');
    for (const item of sanitizedData.sale_items) {
      updateStockStmt.run([item.quantity, now, item.product_id]);
    }
    updateStockStmt.free();

    saveDatabase();

    res.status(201).json({
      success: true,
      data: {
        id: saleId,
        sale_number: saleNumber,
        customer_name: sanitizedData.customer_name,
        customer_email: sanitizedData.customer_email,
        customer_phone: sanitizedData.customer_phone,
        customer_address: sanitizedData.customer_address,
        total_amount: sanitizedData.total_amount,
        tax_amount: sanitizedData.tax_amount,
        discount_amount: sanitizedData.discount_amount,
        amount_paid: sanitizedData.amount_paid,
        payment_method: sanitizedData.payment_method,
        payment_status: sanitizedData.payment_status,
        notes: sanitizedData.notes,
        created_at: now,
        updated_at: now,
        sale_items: sanitizedData.sale_items
      },
      message: 'Sale created successfully'
    });
  } catch (err) {
    console.error('Error creating sale:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to create sale',
      details: err.message
    });
  }
});

// PUT /api/sales/:id - Update sale
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const {
    customer_name,
    customer_email,
    customer_phone,
    customer_address,
    total_amount,
    tax_amount,
    discount_amount,
    amount_paid,
    payment_method,
    payment_status,
    notes,
    sale_items
  } = req.body;

  const db = getDb();
  const now = new Date().toISOString();

  try {
    // Fetch existing sale data to preserve fields that weren't provided in the update
    const existingRows = db.exec('SELECT * FROM sales WHERE id = ?', [id]);
    const existingSale = existingRows[0] && existingRows[0].values.length > 0
      ? (() => {
          const obj = {};
          existingRows[0].columns.forEach((col, index) => {
            obj[col] = existingRows[0].values[0][index];
          });
          return obj;
        })()
      : null;

    if (!existingSale) {
      return res.status(404).json({
        success: false,
        error: 'Sale not found'
      });
    }

    // Fetch existing sale items to recalculate totals if needed
    const existingItemsRows = db.exec('SELECT * FROM sale_items WHERE sale_id = ?', [id]);
    const existingSaleItems = existingItemsRows[0]
      ? existingItemsRows[0].values.map(row => {
          const obj = {};
          existingItemsRows[0].columns.forEach((col, index) => {
            obj[col] = row[index];
          });
          return obj;
        })
      : [];
    const recalculatedTotalFromItems = existingSaleItems.reduce((sum, item) => {
      const unitPrice = Number(item.unit_price) || 0;
      const quantity = Number(item.quantity) || 0;
      const totalPrice = Number(item.total_price);
      if (!Number.isNaN(totalPrice) && totalPrice > 0) {
        return sum + totalPrice;
      }
      return sum + unitPrice * quantity;
    }, 0);

    // Sanitize and validate incoming fields (only those provided)
    const sanitizedData = {};

    if (customer_name !== undefined) {
      sanitizedData.customer_name = customer_name ? String(customer_name).trim() : null;
    }
    if (customer_email !== undefined) {
      sanitizedData.customer_email = customer_email ? String(customer_email).trim() : null;
    }
    if (customer_phone !== undefined) {
      sanitizedData.customer_phone = customer_phone ? String(customer_phone).trim() : null;
    }
    if (customer_address !== undefined) {
      sanitizedData.customer_address = customer_address ? String(customer_address).trim() : null;
    }
    if (total_amount !== undefined) {
      const parsedTotal = Number(total_amount);
      if (Number.isNaN(parsedTotal)) {
        return res.status(400).json({
          success: false,
          error: 'Total amount must be a valid number'
        });
      }
      sanitizedData.total_amount = parsedTotal;
    }
    if (tax_amount !== undefined) {
      const parsedTax = Number(tax_amount);
      if (Number.isNaN(parsedTax)) {
        return res.status(400).json({
          success: false,
          error: 'Tax amount must be a valid number'
        });
      }
      sanitizedData.tax_amount = parsedTax;
    }
    if (discount_amount !== undefined) {
      const parsedDiscount = Number(discount_amount);
      if (Number.isNaN(parsedDiscount)) {
        return res.status(400).json({
          success: false,
          error: 'Discount amount must be a valid number'
        });
      }
      sanitizedData.discount_amount = parsedDiscount;
    }
    if (amount_paid !== undefined) {
      const parsedPaid = Number(amount_paid);
      if (Number.isNaN(parsedPaid)) {
        return res.status(400).json({
          success: false,
          error: 'Amount paid must be a valid number'
        });
      }
      sanitizedData.amount_paid = parsedPaid;
    }
    if (payment_method !== undefined) {
      sanitizedData.payment_method = payment_method ? String(payment_method).trim() : null;
    }
    if (payment_status !== undefined) {
      sanitizedData.payment_status = payment_status ? String(payment_status).trim() : null;
    }
    if (notes !== undefined) {
      sanitizedData.notes = notes ? String(notes).trim() : null;
    }

    // Merge sanitized data with existing sale
    const existingTotalAmount = Number(existingSale.total_amount);
    const fallbackTotalAmount = !Number.isNaN(existingTotalAmount) && existingTotalAmount > 0
      ? existingTotalAmount
      : recalculatedTotalFromItems;

    const updatedSale = {
      customer_name: sanitizedData.customer_name !== undefined ? sanitizedData.customer_name : existingSale.customer_name,
      customer_email: sanitizedData.customer_email !== undefined ? sanitizedData.customer_email : existingSale.customer_email,
      customer_phone: sanitizedData.customer_phone !== undefined ? sanitizedData.customer_phone : existingSale.customer_phone,
      customer_address: sanitizedData.customer_address !== undefined ? sanitizedData.customer_address : existingSale.customer_address,
      total_amount: sanitizedData.total_amount !== undefined ? sanitizedData.total_amount : fallbackTotalAmount,
      tax_amount: sanitizedData.tax_amount !== undefined ? sanitizedData.tax_amount : existingSale.tax_amount,
      discount_amount: sanitizedData.discount_amount !== undefined ? sanitizedData.discount_amount : existingSale.discount_amount,
      amount_paid: sanitizedData.amount_paid !== undefined ? sanitizedData.amount_paid : (existingSale.amount_paid || 0),
      payment_method: sanitizedData.payment_method !== undefined ? sanitizedData.payment_method : existingSale.payment_method,
      notes: sanitizedData.notes !== undefined ? sanitizedData.notes : existingSale.notes
    };

    // Determine the correct payment status
    let finalPaymentStatus = existingSale.payment_status || 'pending';
    if (sanitizedData.amount_paid !== undefined) {
      const totalForStatus = Number(updatedSale.total_amount) || 0;
      finalPaymentStatus = updatedSale.amount_paid >= totalForStatus ? 'completed' : 'pending';
    } else if (sanitizedData.payment_status !== undefined && sanitizedData.payment_status) {
      finalPaymentStatus = sanitizedData.payment_status;
    }

    // Update the main sale record
    const stmt = db.prepare(`
      UPDATE sales SET 
        customer_name = ?, customer_email = ?, customer_phone = ?, customer_address = ?,
        total_amount = ?, tax_amount = ?, discount_amount = ?, amount_paid = ?, payment_method = ?, 
        payment_status = ?, notes = ?, updated_at = ?
      WHERE id = ?
    `);

    const result = stmt.run([
      updatedSale.customer_name ?? null,
      updatedSale.customer_email ?? null,
      updatedSale.customer_phone ?? null,
      updatedSale.customer_address ?? null,
      Number(updatedSale.total_amount) || 0,
      Number(updatedSale.tax_amount) || 0,
      Number(updatedSale.discount_amount) || 0,
      Number(updatedSale.amount_paid) || 0,
      updatedSale.payment_method ?? existingSale.payment_method ?? 'cash',
      finalPaymentStatus,
      updatedSale.notes ?? null,
      now,
      id
    ]);

    stmt.free();

    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        error: 'Sale not found'
      });
    }

    // Update sale items if provided
    if (sale_items && Array.isArray(sale_items)) {
      // Delete existing sale items
      const deleteStmt = db.prepare('DELETE FROM sale_items WHERE sale_id = ?');
      deleteStmt.run([id]);
      deleteStmt.free();

      // Insert updated sale items with proper validation
      const insertStmt = db.prepare(`
        INSERT INTO sale_items (id, sale_id, product_id, quantity, unit_price, total_price, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);

      let newSubtotal = 0;
      for (const item of sale_items) {
        // Validate and sanitize each item
        if (!item.product_id) {
          console.warn('Skipping item with missing product_id:', item);
          continue;
        }

        const itemId = require('uuid').v4();
        const sanitizedItem = {
          product_id: String(item.product_id),
          quantity: item.quantity ? Number(item.quantity) : 1,
          unit_price: item.unit_price ? Number(item.unit_price) : 0,
          total_price: item.total_price ? Number(item.total_price) : 0
        };

        insertStmt.run([
          itemId,
          id,
          sanitizedItem.product_id,
          sanitizedItem.quantity,
          sanitizedItem.unit_price,
          sanitizedItem.total_price,
          now
        ]);

        newSubtotal += sanitizedItem.total_price;
      }
      insertStmt.free();

      // Recalculate and update total_amount based on new items
      const discount = Number(updatedSale.discount_amount) || 0;
      const tax = Number(updatedSale.tax_amount) || 0;
      const newTotalAmount = newSubtotal - discount + tax;

      // Update the sale with recalculated total
      const updateTotalStmt = db.prepare(`
        UPDATE sales SET total_amount = ?, updated_at = ? WHERE id = ?
      `);
      updateTotalStmt.run([newTotalAmount, now, id]);
      updateTotalStmt.free();
    }

    saveDatabase();
    res.json({
      success: true,
      message: 'Sale updated successfully'
    });
  } catch (err) {
    console.error('Error updating sale:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to update sale'
    });
  }
});

// DELETE /api/sales/:id - Delete sale
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const db = getDb();

  try {
    // Get sale items first to restore stock
    const itemsRows = db.exec('SELECT * FROM sale_items WHERE sale_id = ?', [id]);
    const items = itemsRows[0] ? itemsRows[0].values.map(row => {
      const obj = {};
      itemsRows[0].columns.forEach((col, index) => {
        obj[col] = row[index];
      });
      return obj;
    }) : [];

    // Restore product stock
    const updateStockStmt = db.prepare('UPDATE products SET quantity_in_stock = quantity_in_stock + ?, updated_at = ? WHERE id = ?');
    for (const item of items) {
      updateStockStmt.run([item.quantity, new Date().toISOString(), item.product_id]);
    }
    updateStockStmt.free();

    // Delete sale items
    const deleteItemsStmt = db.prepare('DELETE FROM sale_items WHERE sale_id = ?');
    deleteItemsStmt.run([id]);
    deleteItemsStmt.free();

    // Delete sale
    const deleteSaleStmt = db.prepare('DELETE FROM sales WHERE id = ?');
    const result = deleteSaleStmt.run([id]);
    deleteSaleStmt.free();

    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        error: 'Sale not found'
      });
    }

    saveDatabase();
    res.json({
      success: true,
      message: 'Sale deleted successfully'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete sale'
    });
  }
});

module.exports = router;