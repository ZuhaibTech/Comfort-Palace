import { NextRequest, NextResponse } from 'next/server';

// Credentials are read from environment variables.
// Set ADMIN_USERNAME and ADMIN_PASSWORD in Vercel dashboard.
// Falls back to defaults so the app works out of the box.
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'inventory';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '123456';
const SESSION_SECRET = process.env.SESSION_SECRET || 'comfort-palace-secret-2026';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { message: 'Username and password are required.' },
        { status: 400 }
      );
    }

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      // Create a simple session token
      const sessionToken = Buffer.from(
        JSON.stringify({ username, ts: Date.now(), secret: SESSION_SECRET })
      ).toString('base64');

      const response = NextResponse.json(
        { success: true, message: 'Login successful.' },
        { status: 200 }
      );

      // Set an HTTP-only secure cookie valid for 7 days
      response.cookies.set('cp_session', sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      });

      return response;
    }

    return NextResponse.json(
      { message: 'Invalid credentials. Please check your ID and Key.' },
      { status: 401 }
    );
  } catch {
    return NextResponse.json(
      { message: 'Server error. Please try again.' },
      { status: 500 }
    );
  }
}
