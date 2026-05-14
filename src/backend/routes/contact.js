const express = require('express');
const router = express.Router();
const { getDb, saveDatabase } = require('../database');
const nodemailer = require('nodemailer');

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

    const db = getDb();
    const now = new Date().toISOString();

    // Insert contact form submission into database
    const stmt = db.prepare(`
      INSERT INTO contact_forms (id, name, phone, email, requirement, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    
    const contactId = require('uuid').v4();
    stmt.run([contactId, name, phone, email, requirement, now, now]);
    stmt.free();

    // Send email notification
    try {
      const transporter = nodemailer.createTransporter({
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

    saveDatabase();
    
    res.status(201).json({
      success: true,
      message: 'Contact form submitted successfully',
      data: { id: contactId }
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
router.get('/', (req, res) => {
  try {
    const db = getDb();
    const rows = db.exec('SELECT * FROM contact_forms ORDER BY created_at DESC');
    const contacts = rows[0] ? rows[0].values.map(row => {
      const obj = {};
      rows[0].columns.forEach((col, index) => {
        obj[col] = row[index];
      });
      return obj;
    }) : [];

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
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const db = getDb();
    const stmt = db.prepare('SELECT * FROM contact_forms WHERE id = ?');
    const contact = stmt.get([id]);
    stmt.free();

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
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const db = getDb();
    const stmt = db.prepare('DELETE FROM contact_forms WHERE id = ?');
    const result = stmt.run([id]);
    stmt.free();

    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        error: 'Contact form not found'
      });
    }

    saveDatabase();
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
