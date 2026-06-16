import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import ContactForm from '@/lib/models/ContactForm';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const contact = await ContactForm.findById(params.id);

    if (!contact) {
      return NextResponse.json({
        success: false,
        error: 'Contact form not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: contact
    });
  } catch (err) {
    console.error('Error fetching contact form:', err);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch contact form'
    }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const contact = await ContactForm.findByIdAndDelete(params.id);

    if (!contact) {
      return NextResponse.json({
        success: false,
        error: 'Contact form not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Contact form deleted successfully'
    });
  } catch (err) {
    console.error('Error deleting contact form:', err);
    return NextResponse.json({
      success: false,
      error: 'Failed to delete contact form'
    }, { status: 500 });
  }
}
