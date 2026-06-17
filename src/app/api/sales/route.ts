import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Sale from '@/lib/models/Sale';
import Product from '@/lib/models/Product';

export async function GET() {
  try {
    await connectDB();
    const sales = await Sale.find().sort({ created_at: -1 });

    // Build a product-id → gst_percentage lookup to back-fill old sale items
    const allProductIds = new Set<string>();
    sales.forEach(saleDoc => {
      saleDoc.toJSON().sale_items?.forEach((item: any) => {
        if (item.gst_percentage == null && item.product_id) {
          allProductIds.add(String(item.product_id));
        }
      });
    });

    const productGstMap: Record<string, number | null> = {};
    if (allProductIds.size > 0) {
      const products = await Product.find(
        { _id: { $in: Array.from(allProductIds) } },
        { _id: 1, gst_percentage: 1 }
      );
      products.forEach((p: any) => {
        productGstMap[p._id.toString()] = p.gst_percentage ?? null;
      });
    }

    const salesWithItems = sales.map(saleDoc => {
      const sale = saleDoc.toJSON();

      // Back-fill gst_percentage on items where it is missing
      const enrichedItems = (sale.sale_items || []).map((item: any) => {
        if (item.gst_percentage == null && item.product_id) {
          return { ...item, gst_percentage: productGstMap[String(item.product_id)] ?? null };
        }
        return item;
      });

      const recalculatedTotal = enrichedItems.reduce((sum: number, item: any) => {
        const unitPrice = Number(item.unit_price) || 0;
        const quantity = Number(item.quantity) || 0;
        const totalPrice = Number(item.total_price);
        if (!Number.isNaN(totalPrice) && totalPrice !== 0) {
          return sum + totalPrice;
        }
        return sum + unitPrice * quantity;
      }, 0);

      const rawTotal = Number(sale.total_amount);
      const normalizedTotal = (!Number.isNaN(rawTotal) && rawTotal !== 0) ? rawTotal : recalculatedTotal;
      const normalizedAmountPaid = Number(sale.amount_paid) || 0;
      const normalizedStatus = Math.abs(normalizedAmountPaid) >= Math.abs(normalizedTotal) && normalizedTotal !== 0
        ? 'completed'
        : (sale.payment_status || 'pending');

      return {
        ...sale,
        sale_items: enrichedItems,
        total_amount: normalizedTotal,
        amount_paid: normalizedAmountPaid,
        payment_status: normalizedStatus
      };
    });

    return NextResponse.json({
      success: true,
      data: salesWithItems
    });
  } catch (err) {
    console.error('Failed to fetch sales:', err);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch sales'
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const {
      customer_name,
      customer_email,
      customer_phone,
      customer_address,
      delivery_address,
      pan_number,
      total_amount,
      tax_amount,
      discount_amount,
      amount_paid,
      cash_amount,
      upi_amount,
      payment_method,
      payment_status,
      notes,
      is_demo,
      sale_items
    } = body;

    if (!sale_items || !Array.isArray(sale_items) || sale_items.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Sale items are required and must be an array'
      }, { status: 400 });
    }

    if (typeof total_amount !== 'number' || total_amount <= 0) {
      return NextResponse.json({
        success: false,
        error: 'Total amount must be a positive number'
      }, { status: 400 });
    }

    const sanitizedItems = sale_items.map((item: any) => ({
      product_id: String(item.product_id),
      quantity: Number(item.quantity),
      unit_price: Number(item.unit_price),
      total_price: Number(item.total_price),
      gst_percentage: item.gst_percentage != null ? Number(item.gst_percentage) : null
    }));
    
    const enrichedItems = await Promise.all(sanitizedItems.map(async (item) => {
      try {
         const product = await Product.findById(item.product_id);
         if (product) {
           return {
             ...item,
             product_name: product.name,
             product_item_code: product.item_code,
             product_image_url: product.image_url,
             // Use gst_percentage from frontend payload; fall back to product record
             gst_percentage: item.gst_percentage != null ? item.gst_percentage : (product.gst_percentage ?? null)
           };
         }
      } catch(e) {}
      return item;
    }));

    const sanitizedData: any = {
      customer_name: customer_name ? String(customer_name).trim() : null,
      customer_email: customer_email ? String(customer_email).trim() : null,
      customer_phone: customer_phone ? String(customer_phone).trim() : null,
      customer_address: customer_address ? String(customer_address).trim() : null,
      delivery_address: delivery_address ? String(delivery_address).trim() : null,
      pan_number: pan_number ? String(pan_number).trim() : null,
      total_amount: Number(total_amount),
      tax_amount: tax_amount ? Number(tax_amount) : 0,
      discount_amount: discount_amount ? Number(discount_amount) : 0,
      amount_paid: amount_paid ? Number(amount_paid) : 0,
      cash_amount: cash_amount ? Number(cash_amount) : 0,
      upi_amount: upi_amount ? Number(upi_amount) : 0,
      payment_method: payment_method ? String(payment_method).trim() : 'cash',
      payment_status: payment_status ? String(payment_status).trim() : undefined,
      notes: notes ? String(notes).trim() : null,
      is_demo: !!is_demo,
      sale_items: enrichedItems,
      sale_number: (Sale as any).generateSaleNumber()
    };

    if (!sanitizedData.payment_status) {
      sanitizedData.payment_status = sanitizedData.amount_paid >= sanitizedData.total_amount ? 'completed' : 'pending';
    }

    const sale = new Sale(sanitizedData);
    await sale.save();

    for (const item of sanitizedData.sale_items) {
      await Product.findByIdAndUpdate(item.product_id, {
        $inc: { quantity_in_stock: -item.quantity }
      });
    }

    return NextResponse.json({
      success: true,
      data: sale,
      message: 'Sale created successfully'
    }, { status: 201 });
  } catch (err: any) {
    console.error('Error creating sale:', err);
    return NextResponse.json({
      success: false,
      error: 'Failed to create sale',
      details: err.message
    }, { status: 500 });
  }
}
