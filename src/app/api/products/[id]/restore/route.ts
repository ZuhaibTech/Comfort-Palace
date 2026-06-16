import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Product from '@/lib/models/Product';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const product = await Product.findByIdAndUpdate(
      params.id,
      { is_active: 1, archived_at: null },
      { new: true }
    );
    
    if (!product) {
      return NextResponse.json({
        success: false,
        error: 'Product not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Product restored successfully'
    });
  } catch (err) {
    console.error('Failed to restore product:', err);
    return NextResponse.json({
      success: false,
      error: 'Failed to restore product'
    }, { status: 500 });
  }
}
