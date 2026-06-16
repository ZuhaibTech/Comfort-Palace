import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Product from '@/lib/models/Product';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const product = await Product.findById(params.id);

    if (!product) {
      return NextResponse.json({
        success: false,
        error: 'Product not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: product
    });
  } catch (err) {
    console.error('Failed to fetch product:', err);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch product'
    }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const body = await request.json();
    const { 
      item_code, 
      hsn_code,
      name, 
      description, 
      price, 
      cost_price, 
      gst_percentage,
      profit_percentage,
      quantity_in_stock, 
      low_stock_threshold, 
      category, 
      image_url 
    } = body;

    const product = await Product.findByIdAndUpdate(
      params.id,
      {
        item_code, hsn_code: hsn_code || null, name, description, price, cost_price, gst_percentage, profit_percentage,
        quantity_in_stock, low_stock_threshold, category, image_url
      },
      { new: true, runValidators: true }
    );
    
    if (!product) {
      return NextResponse.json({
        success: false,
        error: 'Product not found'
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      data: product,
      message: 'Product updated successfully'
    });
  } catch (err: any) {
    console.error('Product update error:', err);
    if (err.code === 11000) {
      return NextResponse.json({
        success: false,
        error: 'Product with this item code already exists'
      }, { status: 400 });
    }
    
    return NextResponse.json({
      success: false,
      error: 'Failed to update product'
    }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const now = new Date();

    const product = await Product.findByIdAndUpdate(
      params.id,
      { is_active: 0, archived_at: now },
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
      message: 'Product archived successfully'
    });
  } catch (err) {
    console.error('Failed to archive product:', err);
    return NextResponse.json({
      success: false,
      error: 'Failed to archive product'
    }, { status: 500 });
  }
}
