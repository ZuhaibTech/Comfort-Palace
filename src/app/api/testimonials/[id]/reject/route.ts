import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Testimonial from '@/lib/models/Testimonial';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const testimonial = await Testimonial.findByIdAndUpdate(
      params.id,
      { status: 'rejected' },
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
      message: 'Testimonial rejected successfully'
    });
  } catch (err) {
    console.error('Reject testimonial error:', err);
    return NextResponse.json({
      success: false,
      error: 'Failed to reject testimonial'
    }, { status: 500 });
  }
}
