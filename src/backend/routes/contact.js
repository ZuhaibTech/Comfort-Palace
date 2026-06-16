const express = require('express');
const ContactForm = require('../models/ContactForm');
const nodemailer = require('nodemailer');

const router = express.Router();

// Create contact form submission
router.post('/', async (req, res) => {
  try {
    const { name, phone, email, requirement } = req.body;

    // Validate required fields
    if (!name || !phone || !email || !requirement) {
      return res.status(400).json({
        success: false,
        error: 'All fields are required'
      });
    }

    // Create and save to DB
    const contact = new ContactForm({ name, phone, email, requirement });
    await contact.save();

    // Send email notification
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER || 'junaidpasha007@yahoo.com',
          pass: process.env.EMAIL_PASS || 'your-app-password'
        }
      });

      const mailOptions = {
        from: process.env.EMAIL_USER || 'junaidpasha007@yahoo.com',
        to: 'junaidpasha007@yahoo.com',
        subject: 'New Contact Form Submission - Comfort Palace',
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Requirements:</strong></p>
          <p>${requirement}</p>
          <hr>
          <p><em>Submitted on: ${new Date().toLocaleString()}</em></p>
        `
      };

      await transporter.sendMail(mailOptions);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Don't fail the request if email fails
    }

    res.status(201).json({
      success: true,
      message: 'Contact form submitted successfully',
      data: contact
    });
  } catch (err) {
    console.error('Error creating contact form:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to submit contact form'
    });
  }
});

// Get all contact form submissions
router.get('/', async (req, res) => {
  try {
    const contacts = await ContactForm.find().sort({ created_at: -1 });

    res.json({
      success: true,
      data: contacts
    });
  } catch (err) {
    console.error('Error fetching contact forms:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch contact forms'
    });
  }
});

// Get single contact form submission
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await ContactForm.findById(id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        error: 'Contact form not found'
      });
    }

    res.json({
      success: true,
      data: contact
    });
  } catch (err) {
    console.error('Error fetching contact form:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch contact form'
    });
  }
});

// Delete contact form submission
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await ContactForm.findByIdAndDelete(id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        error: 'Contact form not found'
      });
    }

    res.json({
      success: true,
      message: 'Contact form deleted successfully'
    });
  } catch (err) {
    console.error('Error deleting contact form:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to delete contact form'
    });
  }
});

module.exports = router;
