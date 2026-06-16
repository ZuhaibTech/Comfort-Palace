import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Product from '@/lib/models/Product';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const archived = searchParams.get('archived');
    
    await connectDB();
    
    const query = archived === 'true' ? { is_active: 0 } : { is_active: 1 };
    const products = await Product.find(query).sort({ created_at: -1 });
    
    return NextResponse.json({
      success: true,
      data: products
    });
  } catch (err) {
    console.error('Failed to fetch products:', err);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch products'
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
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

    if (!item_code || !name || !price) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: item_code, name, price'
      }, { status: 400 });
    }

    const product = new Product({
      item_code, 
      hsn_code: hsn_code || null, 
      name, 
      description: description || null, 
      price, 
      cost_price: cost_price || null, 
      gst_percentage: gst_percentage || null, 
      profit_percentage: profit_percentage || null,
      quantity_in_stock: quantity_in_stock || 0, 
      low_stock_threshold: low_stock_threshold || 10, 
      category: category || null, 
      image_url: image_url || null,
      is_active: 1
    });

    await product.save();

    return NextResponse.json({
      success: true,
      data: product,
      message: 'Product created successfully'
    }, { status: 201 });
  } catch (err: any) {
    console.error('Product creation error:', err);
    if (err.code === 11000) {
      return NextResponse.json({
        success: false,
        error: 'Product with this item code already exists'
      }, { status: 400 });
    }
    
    return NextResponse.json({
      success: false,
      error: 'Failed to create product'
    }, { status: 500 });
  }
}
