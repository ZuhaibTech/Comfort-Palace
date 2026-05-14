const express = require('express');
const { getDb, saveDatabase } = require('../database');
const router = express.Router();

// POST /api/testimonials - Submit a new testimonial (public)
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, rating, description } = req.body;

    // Validation
    if (!name || !email || !phone || !rating || !description) {
      return res.status(400).json({
        success: false,
        error: 'All fields are required'
      });
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        error: 'Rating must be between 1 and 5'
      });
    }

    const db = getDb();
    const id = 'testimonial_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    const now = new Date().toISOString();

    const stmt = db.prepare(`
      INSERT INTO testimonials (id, name, email, phone, rating, description, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, 'pending', ?, ?)
    `);
    
    stmt.run([id, name, email, phone, rating, description, now, now]);
    stmt.free();
    
    saveDatabase();

    res.json({
      success: true,
      message: 'Thank you for your feedback! Your testimonial will be reviewed by our team.',
      data: { id }
    });
  } catch (err) {
    console.error('Testimonial submission error:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to submit testimonial'
    });
  }
});

// GET /api/testimonials - Get all approved testimonials (public)
router.get('/', async (req, res) => {
  try {
    const db = getDb();
    const stmt = db.prepare(`
      SELECT id, name, rating, description, created_at
      FROM testimonials
      WHERE status = 'approved'
      ORDER BY created_at DESC
    `);
    
    const testimonials = [];
    while (stmt.step()) {
      const row = stmt.getAsObject();
      testimonials.push(row);
    }
    stmt.free();

    res.json({
      success: true,
      data: testimonials
    });
  } catch (err) {
    console.error('Get testimonials error:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch testimonials'
    });
  }
});

// GET /api/testimonials/all - Get all testimonials with filters (admin)
router.get('/all', async (req, res) => {
  try {
    const { status } = req.query;
    const db = getDb();
    
    let query = `
      SELECT id, name, email, phone, rating, description, status, created_at, updated_at
      FROM testimonials
    `;
    
    const params = [];
    if (status && ['pending', 'approved', 'rejected'].includes(status)) {
      query += ` WHERE status = ?`;
      params.push(status);
    }
    
    query += ` ORDER BY created_at DESC`;
    
    const stmt = db.prepare(query);
    
    const testimonials = [];
    if (params.length > 0) {
      stmt.bind(params);
    }
    
    while (stmt.step()) {
      const row = stmt.getAsObject();
      testimonials.push(row);
    }
    stmt.free();

    res.json({
      success: true,
      data: testimonials
    });
  } catch (err) {
    console.error('Get all testimonials error:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch testimonials'
    });
  }
});

// PUT /api/testimonials/:id/approve - Approve a testimonial (admin)
router.put('/:id/approve', async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDb();
    const now = new Date().toISOString();

    const stmt = db.prepare(`
      UPDATE testimonials
      SET status = 'approved', updated_at = ?
      WHERE id = ?
    `);
    
    stmt.run([now, id]);
    const changes = db.getRowsModified();
    stmt.free();
    
    if (changes === 0) {
      return res.status(404).json({
        success: false,
        error: 'Testimonial not found'
      });
    }
    
    saveDatabase();

    res.json({
      success: true,
      message: 'Testimonial approved successfully'
    });
  } catch (err) {
    console.error('Approve testimonial error:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to approve testimonial'
    });
  }
});

// PUT /api/testimonials/:id/reject - Reject a testimonial (admin)
router.put('/:id/reject', async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDb();
    const now = new Date().toISOString();

    const stmt = db.prepare(`
      UPDATE testimonials
      SET status = 'rejected', updated_at = ?
      WHERE id = ?
    `);
    
    stmt.run([now, id]);
    const changes = db.getRowsModified();
    stmt.free();
    
    if (changes === 0) {
      return res.status(404).json({
        success: false,
        error: 'Testimonial not found'
      });
    }
    
    saveDatabase();

    res.json({
      success: true,
      message: 'Testimonial rejected successfully'
    });
  } catch (err) {
    console.error('Reject testimonial error:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to reject testimonial'
    });
  }
});

// DELETE /api/testimonials/:id - Delete a testimonial (admin)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDb();

    const stmt = db.prepare(`DELETE FROM testimonials WHERE id = ?`);
    stmt.run([id]);
    const changes = db.getRowsModified();
    stmt.free();
    
    if (changes === 0) {
      return res.status(404).json({
        success: false,
        error: 'Testimonial not found'
      });
    }
    
    saveDatabase();

    res.json({
      success: true,
      message: 'Testimonial deleted successfully'
    });
  } catch (err) {
    console.error('Delete testimonial error:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to delete testimonial'
    });
  }
});

module.exports = router;

