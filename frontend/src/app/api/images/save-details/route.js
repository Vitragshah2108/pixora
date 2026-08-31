import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { cookies } from 'next/headers';

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Get auth token from NextAuth session or header
    let authToken = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');

    if (!authToken) {
      const token = await getToken({ 
        req: request,
        secret: process.env.NEXTAUTH_SECRET || "vitragshahisplayingchess-pixora-auth-secret"
      });
      authToken = token?.backendToken;
    }
    
    if (!authToken) {
      const cookieStore = await cookies();
      const possibleCookies = ['token', 'auth-token', 'next-auth.session-token', '__Secure-next-auth.session-token'];
      for (const cookieName of possibleCookies) {
        const cookie = cookieStore.get(cookieName);
        if (cookie?.value) {
          authToken = cookie.value;
          break;
        }
      }
    }

    const headers = { 'Content-Type': 'application/json' };
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
      headers['Cookie'] = `token=${authToken}`;
    }
    
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API || (process.env.NODE_ENV === 'production' ? 'https://backend-blush-ten-49.vercel.app' : 'http://localhost:5000');
    
    const response = await fetch(`${backendUrl}/api/images/save-details`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });
    
    const responseText = await response.text();
    let data;
    try {
      data = JSON.parse(responseText);
    } catch {
      data = { success: false, message: responseText || 'Failed to save image details' };
    }
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error in save-details proxy route:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
