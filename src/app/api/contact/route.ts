import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import ContactForm from '@/lib/models/ContactForm';
import nodemailer from 'nodemailer';

export async function GET() {
  try {
    await connectDB();
    const contacts = await ContactForm.find().sort({ created_at: -1 });

    return NextResponse.json({
      success: true,
      data: contacts
    });
  } catch (err) {
    console.error('Error fetching contact forms:', err);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch contact forms'
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { name, phone, email, requirement } = body;

    if (!name || !phone || !email || !requirement) {
      return NextResponse.json({
        success: false,
        error: 'All fields are required'
      }, { status: 400 });
    }

    const contact = new ContactForm({ name, phone, email, requirement });
    await contact.save();

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
    }

    return NextResponse.json({
      success: true,
      message: 'Contact form submitted successfully',
      data: contact
    }, { status: 201 });
  } catch (err) {
    console.error('Error creating contact form:', err);
    return NextResponse.json({
      success: false,
      error: 'Failed to submit contact form'
    }, { status: 500 });
  }
}
