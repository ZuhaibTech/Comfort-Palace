import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Testimonial from '@/lib/models/Testimonial';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const testimonial = await Testimonial.findByIdAndUpdate(
      params.id,
      { status: 'approved' },
      { new: true }
    );
    
    if (!testimonial) {
      return NextResponse.json({
        success: false,
        error: 'Testimonial not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Testimonial approved successfully'
    });
  } catch (err) {
    console.error('Approve testimonial error:', err);
    return NextResponse.json({
      success: false,
      error: 'Failed to approve testimonial'
    }, { status: 500 });
  }
}
