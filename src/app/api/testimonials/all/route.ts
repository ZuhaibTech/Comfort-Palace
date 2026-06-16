import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Testimonial from '@/lib/models/Testimonial';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    
    await connectDB();
    
    let query: any = {};
    if (status && ['pending', 'approved', 'rejected'].includes(status)) {
      query.status = status;
    }
    
    const testimonials = await Testimonial.find(query).sort({ created_at: -1 });

    return NextResponse.json({
      success: true,
      data: testimonials
    });
  } catch (err) {
    console.error('Get all testimonials error:', err);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch testimonials'
    }, { status: 500 });
  }
}
