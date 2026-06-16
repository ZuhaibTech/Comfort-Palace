import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Sale from '@/lib/models/Sale';
import Product from '@/lib/models/Product';

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { original_sale_id, return_items, notes } = body;
    
    if (!original_sale_id || !return_items || return_items.length === 0) {
      return NextResponse.json({ success: false, error: 'Original sale ID and return items are required' }, { status: 400 });
    }

    const originalSale = await Sale.findById(original_sale_id);
    if (!originalSale) {
      return NextResponse.json({ success: false, error: 'Original sale not found' }, { status: 404 });
    }
    
    let totalReturnAmount = 0;
    const sanitizedItems = await Promise.all(return_items.map(async (item: any) => {
      const qty = Number(item.quantity);
      const price = Number(item.unit_price);
      const total = qty * price;
      totalReturnAmount += total;
      
      let enrichedItem: any = {
        product_id: String(item.product_id),
        quantity: -qty,
        unit_price: price,
        total_price: -total
      };
      
      try {
         const product = await Product.findById(item.product_id);
         if (product) {
           enrichedItem.product_name = product.name;
           enrichedItem.product_item_code = product.item_code;
           enrichedItem.product_image_url = product.image_url;
         }
      } catch(e) {}
      
      return enrichedItem;
    }));

    const suffix = Date.now().toString().slice(-4);
    const returnNumber = originalSale.sale_number + '-R-' + suffix;

    const returnSale = new Sale({
      sale_number: returnNumber,
      customer_name: originalSale.customer_name,
      customer_email: originalSale.customer_email,
      customer_phone: originalSale.customer_phone,
      customer_address: originalSale.customer_address,
      total_amount: -totalReturnAmount,
      amount_paid: -totalReturnAmount,
      payment_method: 'refund',
      payment_status: 'completed',
      notes: notes || 'Return for sale ' + originalSale.sale_number,
      is_return: 1,
      original_sale_id: original_sale_id,
      sale_items: sanitizedItems
    });
    
    await returnSale.save();

    for (const item of sanitizedItems) {
      await Product.findByIdAndUpdate(item.product_id, {
        $inc: { quantity_in_stock: Math.abs(item.quantity) }
      });
    }

    return NextResponse.json({
      success: true,
      data: returnSale
    });

  } catch (err: any) {
    console.error('Return error:', err);
    return NextResponse.json({ success: false, error: err.message || 'Failed to process return' }, { status: 500 });
  }
}
