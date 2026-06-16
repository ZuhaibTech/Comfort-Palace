import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Sale from '@/lib/models/Sale';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');

    if (!q) {
      return NextResponse.json({ success: true, data: [] });
    }

    await connectDB();

    const sales = await Sale.find({
      $and: [
        { is_return: 0 },
        {
          $or: [
            { sale_number: { $regex: q, $options: 'i' } },
            { customer_name: { $regex: q, $options: 'i' } }
          ]
        }
      ]
    }).sort({ created_at: -1 }).limit(20);

    return NextResponse.json({ success: true, data: sales });
  } catch (err) {
    console.error('Search error:', err);
    return NextResponse.json({ success: false, error: 'Failed to search sales' }, { status: 500 });
  }
}
