import { NextResponse } from 'next/server';


export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 });
    }

    // Check file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'image/x-icon', 'image/vnd.microsoft.icon'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ success: false, error: 'Only image files are allowed' }, { status: 400 });
    }

    // Check file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: 'File too large. Maximum size is 5MB.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const base64Data = buffer.toString('base64');
    const fileUrl = `data:${file.type};base64,${base64Data}`;

    return NextResponse.json({
      success: true,
      data: {
        filename: file.name,
        url: fileUrl,
        originalName: file.name,
        size: file.size
      },
      message: 'File uploaded successfully'
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to upload file'
    }, { status: 500 });
  }
}
