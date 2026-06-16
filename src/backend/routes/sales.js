const express = require('express');
const Sale = require('../models/Sale');
const Product = require('../models/Product');

const router = express.Router();

// GET /api/sales - Get all sales
router.get('/', async (req, res) => {
  try {
    const sales = await Sale.find().sort({ created_at: -1 });

    const salesWithItems = sales.map(saleDoc => {
      const sale = saleDoc.toJSON(); // Mongoose toJSON applies virtuals (id mapping)
      
      const recalculatedTotal = sale.sale_items.reduce((sum, item) => {
        const unitPrice = Number(item.unit_price) || 0;
        const quantity = Number(item.quantity) || 0;
        const totalPrice = Number(item.total_price);
        if (!Number.isNaN(totalPrice) && totalPrice !== 0) {
          return sum + totalPrice;
        }
        return sum + unitPrice * quantity;
      }, 0);

      const rawTotal = Number(sale.total_amount);
      const normalizedTotal = (!Number.isNaN(rawTotal) && rawTotal !== 0) ? rawTotal : recalculatedTotal;
      const normalizedAmountPaid = Number(sale.amount_paid) || 0;
      const normalizedStatus = Math.abs(normalizedAmountPaid) >= Math.abs(normalizedTotal) && normalizedTotal !== 0
        ? 'completed'
        : (sale.payment_status || 'pending');

      return {
        ...sale,
        total_amount: normalizedTotal,
        amount_paid: normalizedAmountPaid,
        payment_status: normalizedStatus
      };
    });

    res.json({
      success: true,
      data: salesWithItems
    });
  } catch (err) {
    console.error('Failed to fetch sales:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch sales'
    });
  }
});

// GET /api/sales/search - Search sales
router.get('/search', async (req, res) => {
  const { q } = req.query;
  if (!q) {
    return res.json({ success: true, data: [] });
  }

  try {
    const sales = await Sale.find({
      $and: [
        { is_return: 0 },
        {
          $or: [
            { sale_number: { $regex: q, $options: 'i' } },
            { customer_name: { $regex: q, $options: 'i' } }
          ]
        }
      ]
    }).sort({ created_at: -1 }).limit(20);

    res.json({ success: true, data: sales });
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ success: false, error: 'Failed to search sales' });
  }
});

// GET /api/sales/:id - Get single sale
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const sale = await Sale.findById(id);

    if (!sale) {
      return res.status(404).json({
        success: false,
        error: 'Sale not found'
      });
    }

    res.json({
      success: true,
      data: sale
    });
  } catch (err) {
    console.error('Failed to fetch sale:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch sale'
    });
  }
});

// POST /api/sales - Create new sale
router.post('/', async (req, res) => {
  try {
    const {
      customer_name,
      customer_email,
      customer_phone,
      customer_address,
      delivery_address,
      pan_number,
      total_amount,
      tax_amount,
      discount_amount,
      amount_paid,
      cash_amount,
      upi_amount,
      payment_method,
      payment_status,
      notes,
      sale_items
    } = req.body;

    // Validate and sanitize inputs
    if (!sale_items || !Array.isArray(sale_items) || sale_items.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Sale items are required and must be an array'
      });
    }

    if (typeof total_amount !== 'number' || total_amount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Total amount must be a positive number'
      });
    }

    // Prepare sale items for Mongoose
    const sanitizedItems = sale_items.map(item => ({
      product_id: String(item.product_id),
      quantity: Number(item.quantity),
      unit_price: Number(item.unit_price),
      total_price: Number(item.total_price)
    }));
    
    // Attempt to enrich sale items with current product snapshot data
    const enrichedItems = await Promise.all(sanitizedItems.map(async (item) => {
      try {
         const product = await Product.findById(item.product_id);
         if (product) {
           return {
             ...item,
             product_name: product.name,
             product_item_code: product.item_code,
             product_image_url: product.image_url
           };
         }
      } catch(e) {}
      return item;
    }));

    const sanitizedData = {
      customer_name: customer_name ? String(customer_name).trim() : null,
      customer_email: customer_email ? String(customer_email).trim() : null,
      customer_phone: customer_phone ? String(customer_phone).trim() : null,
      customer_address: customer_address ? String(customer_address).trim() : null,
      delivery_address: delivery_address ? String(delivery_address).trim() : null,
      pan_number: pan_number ? String(pan_number).trim() : null,
      total_amount: Number(total_amount),
      tax_amount: tax_amount ? Number(tax_amount) : 0,
      discount_amount: discount_amount ? Number(discount_amount) : 0,
      amount_paid: amount_paid ? Number(amount_paid) : 0,
      cash_amount: cash_amount ? Number(cash_amount) : 0,
      upi_amount: upi_amount ? Number(upi_amount) : 0,
      payment_method: payment_method ? String(payment_method).trim() : 'cash',
      payment_status: payment_status ? String(payment_status).trim() : undefined,
      notes: notes ? String(notes).trim() : null,
      sale_items: enrichedItems,
      sale_number: Sale.generateSaleNumber()
    };

    if (!sanitizedData.payment_status) {
      sanitizedData.payment_status = sanitizedData.amount_paid >= sanitizedData.total_amount ? 'completed' : 'pending';
    }

    const sale = new Sale(sanitizedData);
    await sale.save();

    // Update product stock
    for (const item of sanitizedData.sale_items) {
      await Product.findByIdAndUpdate(item.product_id, {
        $inc: { quantity_in_stock: -item.quantity }
      });
    }

    res.status(201).json({
      success: true,
      data: sale,
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
router.put('/:id', async (req, res) => {
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
    cash_amount,
    upi_amount,
    payment_method,
    payment_status,
    notes,
    sale_items
  } = req.body;

  try {
    const existingSale = await Sale.findById(id);

    if (!existingSale) {
      return res.status(404).json({
        success: false,
        error: 'Sale not found'
      });
    }

    let enrichedItems = existingSale.sale_items;

    // Handle stock updates if sale_items changed
    if (sale_items && Array.isArray(sale_items)) {
      // Restore stock for old items
      for (const item of existingSale.sale_items) {
        await Product.findByIdAndUpdate(item.product_id, {
          $inc: { quantity_in_stock: item.quantity }
        });
      }

      // Prepare new items
      const sanitizedItems = sale_items.map(item => ({
        product_id: String(item.product_id),
        quantity: Number(item.quantity),
        unit_price: Number(item.unit_price),
        total_price: Number(item.total_price)
      }));
      
      enrichedItems = await Promise.all(sanitizedItems.map(async (item) => {
        try {
           const product = await Product.findById(item.product_id);
           if (product) {
             return {
               ...item,
               product_name: product.name,
               product_item_code: product.item_code,
               product_image_url: product.image_url
             };
           }
        } catch(e) {}
        return item;
      }));

      // Deduct stock for new items
      for (const item of enrichedItems) {
        await Product.findByIdAndUpdate(item.product_id, {
          $inc: { quantity_in_stock: -item.quantity }
        });
      }
    }

    const updatedData = {
      customer_name: customer_name !== undefined ? String(customer_name).trim() : existingSale.customer_name,
      customer_email: customer_email !== undefined ? String(customer_email).trim() : existingSale.customer_email,
      customer_phone: customer_phone !== undefined ? String(customer_phone).trim() : existingSale.customer_phone,
      customer_address: customer_address !== undefined ? String(customer_address).trim() : existingSale.customer_address,
      delivery_address: req.body.delivery_address !== undefined ? String(req.body.delivery_address).trim() : existingSale.delivery_address,
      pan_number: req.body.pan_number !== undefined ? String(req.body.pan_number).trim() : existingSale.pan_number,
      total_amount: total_amount !== undefined ? Number(total_amount) : existingSale.total_amount,
      tax_amount: tax_amount !== undefined ? Number(tax_amount) : existingSale.tax_amount,
      discount_amount: discount_amount !== undefined ? Number(discount_amount) : existingSale.discount_amount,
      amount_paid: amount_paid !== undefined ? Number(amount_paid) : existingSale.amount_paid,
      cash_amount: cash_amount !== undefined ? Number(cash_amount) : existingSale.cash_amount,
      upi_amount: upi_amount !== undefined ? Number(upi_amount) : existingSale.upi_amount,
      payment_method: payment_method !== undefined ? String(payment_method).trim() : existingSale.payment_method,
      payment_status: payment_status !== undefined ? String(payment_status).trim() : existingSale.payment_status,
      notes: notes !== undefined ? String(notes).trim() : existingSale.notes,
      sale_items: enrichedItems
    };

    if (amount_paid !== undefined && payment_status === undefined) {
      updatedData.payment_status = updatedData.amount_paid >= updatedData.total_amount ? 'completed' : 'pending';
    }

    const updatedSale = await Sale.findByIdAndUpdate(id, updatedData, { new: true });

    res.json({
      success: true,
      data: updatedSale,
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
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const sale = await Sale.findById(id);

    if (!sale) {
      return res.status(404).json({
        success: false,
        error: 'Sale not found'
      });
    }

    // Restore stock
    for (const item of sale.sale_items) {
      await Product.findByIdAndUpdate(item.product_id, {
        $inc: { quantity_in_stock: item.quantity }
      });
    }

    await Sale.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Sale deleted successfully'
    });
  } catch (err) {
    console.error('Error deleting sale:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to delete sale'
    });
  }
});

// POST /api/sales/return - Create a return invoice
router.post('/return', async (req, res) => {
  try {
    const { original_sale_id, return_items, notes } = req.body;
    
    if (!original_sale_id || !return_items || return_items.length === 0) {
      return res.status(400).json({ success: false, error: 'Original sale ID and return items are required' });
    }

    const originalSale = await Sale.findById(original_sale_id);
    if (!originalSale) {
      return res.status(404).json({ success: false, error: 'Original sale not found' });
    }
    
    // Calculate return amount and build enriched items
    let totalReturnAmount = 0;
    const sanitizedItems = await Promise.all(return_items.map(async item => {
      const qty = Number(item.quantity);
      const price = Number(item.unit_price);
      const total = qty * price;
      totalReturnAmount += total;
      
      let enrichedItem = {
        product_id: String(item.product_id),
        quantity: -qty, // negative for return
        unit_price: price,
        total_price: -total // negative for return
      };
      
      try {
         const product = await Product.findById(item.product_id);
         if (product) {
           enrichedItem.product_name = product.name;
           enrichedItem.product_item_code = product.item_code;
           enrichedItem.product_image_url = product.image_url;
         }
      } catch(e) {}
      
      return enrichedItem;
    }));

    const suffix = Date.now().toString().slice(-4);
    const returnNumber = originalSale.sale_number + '-R-' + suffix;

    const returnSale = new Sale({
      sale_number: returnNumber,
      customer_name: originalSale.customer_name,
      customer_email: originalSale.customer_email,
      customer_phone: originalSale.customer_phone,
      customer_address: originalSale.customer_address,
      total_amount: -totalReturnAmount,
      amount_paid: -totalReturnAmount,
      payment_method: 'refund',
      payment_status: 'completed',
      notes: notes || 'Return for sale ' + originalSale.sale_number,
      is_return: 1,
      original_sale_id: original_sale_id,
      sale_items: sanitizedItems
    });
    
    await returnSale.save();

    // Restock products (since return item quantities are negative, $inc with absolute values, or just subtract the negative)
    for (const item of sanitizedItems) {
      await Product.findByIdAndUpdate(item.product_id, {
        $inc: { quantity_in_stock: Math.abs(item.quantity) }
      });
    }

    res.json({
      success: true,
      data: returnSale
    });

  } catch (err) {
    console.error('Return error:', err);
    res.status(500).json({ success: false, error: err.message || 'Failed to process return' });
  }
});

module.exports = router;