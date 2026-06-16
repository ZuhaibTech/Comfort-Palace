import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Testimonial from '@/lib/models/Testimonial';

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const testimonial = await Testimonial.findByIdAndDelete(params.id);
    
    if (!testimonial) {
      return NextResponse.json({
        success: false,
        error: 'Testimonial not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Testimonial deleted successfully'
    });
  } catch (err) {
    console.error('Delete testimonial error:', err);
    return NextResponse.json({
      success: false,
      error: 'Failed to delete testimonial'
    }, { status: 500 });
  }
}
