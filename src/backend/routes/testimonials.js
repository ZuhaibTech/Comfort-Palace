const express = require('express');
const Testimonial = require('../models/Testimonial');

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

    const testimonial = new Testimonial({ name, email, phone, rating, description, status: 'pending' });
    await testimonial.save();

    res.status(201).json({
      success: true,
      message: 'Thank you for your feedback! Your testimonial will be reviewed by our team.',
      data: testimonial
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
    const testimonials = await Testimonial.find({ status: 'approved' })
      .select('name rating description created_at')
      .sort({ created_at: -1 });

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
    
    let query = {};
    if (status && ['pending', 'approved', 'rejected'].includes(status)) {
      query.status = status;
    }
    
    const testimonials = await Testimonial.find(query).sort({ created_at: -1 });

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

    const testimonial = await Testimonial.findByIdAndUpdate(
      id,
      { status: 'approved' },
      { new: true }
    );
    
    if (!testimonial) {
      return res.status(404).json({
        success: false,
        error: 'Testimonial not found'
      });
    }

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

    const testimonial = await Testimonial.findByIdAndUpdate(
      id,
      { status: 'rejected' },
      { new: true }
    );
    
    if (!testimonial) {
      return res.status(404).json({
        success: false,
        error: 'Testimonial not found'
      });
    }

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

    const testimonial = await Testimonial.findByIdAndDelete(id);
    
    if (!testimonial) {
      return res.status(404).json({
        success: false,
        error: 'Testimonial not found'
      });
    }

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
