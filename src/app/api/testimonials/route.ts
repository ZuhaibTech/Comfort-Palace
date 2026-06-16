import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Testimonial from '@/lib/models/Testimonial';

export async function GET() {
  try {
    await connectDB();
    const testimonials = await Testimonial.find({ status: 'approved' })
      .select('name rating description created_at')
      .sort({ created_at: -1 });

    return NextResponse.json({
      success: true,
      data: testimonials
    });
  } catch (err) {
    console.error('Get testimonials error:', err);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch testimonials'
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { name, email, phone, rating, description } = body;

    if (!name || !email || !phone || !rating || !description) {
      return NextResponse.json({
        success: false,
        error: 'All fields are required'
      }, { status: 400 });
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({
        success: false,
        error: 'Rating must be between 1 and 5'
      }, { status: 400 });
    }

    const testimonial = new Testimonial({ name, email, phone, rating, description, status: 'pending' });
    await testimonial.save();

    return NextResponse.json({
      success: true,
      message: 'Thank you for your feedback! Your testimonial will be reviewed by our team.',
      data: testimonial
    }, { status: 201 });
  } catch (err) {
    console.error('Testimonial submission error:', err);
    return NextResponse.json({
      success: false,
      error: 'Failed to submit testimonial'
    }, { status: 500 });
  }
}
