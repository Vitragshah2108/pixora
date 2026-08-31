import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { cookies } from 'next/headers';

export async function POST(request) {
  try {
    const formData = await request.formData();
    
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

    const forwardData = new FormData();
    for (const [key, value] of formData.entries()) {
      forwardData.append(key, value);
    }
    
    const headers = {};
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
      headers['Cookie'] = `token=${authToken}`;
    }
    
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API || (process.env.NODE_ENV === 'production' ? 'https://backend-blush-ten-49.vercel.app' : 'http://localhost:5000');
    
    const response = await fetch(`${backendUrl}/api/images/upload-temp`, {
      method: 'POST',
      headers,
      body: forwardData,
    });
    
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error in upload-temp proxy route:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
