import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Sale from '@/lib/models/Sale';
import Product from '@/lib/models/Product';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const sale = await Sale.findById(params.id) as any;

    if (!sale) {
      return NextResponse.json({
        success: false,
        error: 'Sale not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: sale
    });
  } catch (err) {
    console.error('Failed to fetch sale:', err);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch sale'
    }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
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
      sale_items
    } = body;

    const existingSale = await Sale.findById(params.id) as any;

    if (!existingSale) {
      return NextResponse.json({
        success: false,
        error: 'Sale not found'
      }, { status: 404 });
    }

    let enrichedItems = existingSale.sale_items;

    if (sale_items && Array.isArray(sale_items)) {
      for (const item of existingSale.sale_items) {
        await Product.findByIdAndUpdate(item.product_id, {
          $inc: { quantity_in_stock: item.quantity }
        });
      }

      const sanitizedItems = sale_items.map(item => ({
        product_id: String(item.product_id),
        quantity: Number(item.quantity),
        unit_price: Number(item.unit_price),
        total_price: Number(item.total_price)
      }));
      
      enrichedItems = await Promise.all(sanitizedItems.map(async (item) => {
        try {
           const product = await Product.findById(item.product_id);
           if (product) {
             return {
               ...item,
               product_name: product.name,
               product_item_code: product.item_code,
               product_image_url: product.image_url
             };
           }
        } catch(e) {}
        return item;
      }));

      for (const item of enrichedItems) {
        await Product.findByIdAndUpdate(item.product_id, {
          $inc: { quantity_in_stock: -item.quantity }
        });
      }
    }

    const updatedData: any = {
      customer_name: customer_name !== undefined ? String(customer_name).trim() : existingSale.customer_name,
      customer_email: customer_email !== undefined ? String(customer_email).trim() : existingSale.customer_email,
      customer_phone: customer_phone !== undefined ? String(customer_phone).trim() : existingSale.customer_phone,
      customer_address: customer_address !== undefined ? String(customer_address).trim() : existingSale.customer_address,
      delivery_address: delivery_address !== undefined ? String(delivery_address).trim() : existingSale.delivery_address,
      pan_number: pan_number !== undefined ? String(pan_number).trim() : existingSale.pan_number,
      total_amount: total_amount !== undefined ? Number(total_amount) : existingSale.total_amount,
      tax_amount: tax_amount !== undefined ? Number(tax_amount) : existingSale.tax_amount,
      discount_amount: discount_amount !== undefined ? Number(discount_amount) : existingSale.discount_amount,
      amount_paid: amount_paid !== undefined ? Number(amount_paid) : existingSale.amount_paid,
      cash_amount: cash_amount !== undefined ? Number(cash_amount) : existingSale.cash_amount,
      upi_amount: upi_amount !== undefined ? Number(upi_amount) : existingSale.upi_amount,
      payment_method: payment_method !== undefined ? String(payment_method).trim() : existingSale.payment_method,
      payment_status: payment_status !== undefined ? String(payment_status).trim() : existingSale.payment_status,
      notes: notes !== undefined ? String(notes).trim() : existingSale.notes,
      sale_items: enrichedItems
    };

    if (amount_paid !== undefined && payment_status === undefined) {
      updatedData.payment_status = updatedData.amount_paid >= updatedData.total_amount ? 'completed' : 'pending';
    }

    const updatedSale = await Sale.findByIdAndUpdate(params.id, updatedData, { new: true });

    return NextResponse.json({
      success: true,
      data: updatedSale,
      message: 'Sale updated successfully'
    });
  } catch (err) {
    console.error('Error updating sale:', err);
    return NextResponse.json({
      success: false,
      error: 'Failed to update sale'
    }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const sale = await Sale.findById(params.id) as any;

    if (!sale) {
      return NextResponse.json({
        success: false,
        error: 'Sale not found'
      }, { status: 404 });
    }

    for (const item of sale.sale_items) {
      await Product.findByIdAndUpdate(item.product_id, {
        $inc: { quantity_in_stock: item.quantity }
      });
    }

    await Sale.findByIdAndDelete(params.id);

    return NextResponse.json({
      success: true,
      message: 'Sale deleted successfully'
    });
  } catch (err) {
    console.error('Error deleting sale:', err);
    return NextResponse.json({
      success: false,
      error: 'Failed to delete sale'
    }, { status: 500 });
  }
}
