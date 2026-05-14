const express = require('express');
const crypto = require('crypto');
let nodemailer; try { nodemailer = require('nodemailer'); } catch {}

const router = express.Router();

// In-memory reset token store: token -> { expiresAt }
const resetTokens = new Map();

const RECIPIENT_EMAIL = process.env.RECIPIENT_EMAIL || 'thecomfortpalace123@gmail.com';

router.post('/forgot', async (req, res) => {
  try {
    // Always generate a reset link for the configured recipient
    const token = crypto.randomBytes(24).toString('hex');
    const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes
    resetTokens.set(token, { expiresAt });

    const baseUrl = process.env.PUBLIC_URL || '';
    const link = `${baseUrl}/reset?token=${token}`;

    // Try to email if SMTP is configured
    if (nodemailer && process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: false,
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      });
      await transporter.sendMail({
        from: process.env.MAIL_FROM || `no-reply@${new URL(baseUrl || 'http://localhost').hostname}`,
        to: RECIPIENT_EMAIL,
        subject: 'Password reset request',
        text: `Use this link to reset your password: ${link}`,
        html: `<p>Use this link to reset your password:</p><p><a href="${link}">${link}</a></p>`,
      });
    } else {
      console.log('[Password Reset] SMTP not configured; share this link securely:', link);
    }

    res.json({ success: true });
  } catch (e) {
    console.error('Forgot password error:', e);
    res.status(500).json({ success: false, error: 'Failed to start password reset' });
  }
});

router.post('/reset', (req, res) => {
  const { token } = req.body;
  if (!token || !resetTokens.has(token)) {
    return res.status(400).json({ success: false, error: 'Invalid or expired token' });
  }
  const record = resetTokens.get(token);
  if (!record || record.expiresAt < Date.now()) {
    resetTokens.delete(token);
    return res.status(400).json({ success: false, error: 'Token expired' });
  }
  resetTokens.delete(token);
  // No server-side password storage; client will update local password on success
  return res.json({ success: true });
});

module.exports = router;












