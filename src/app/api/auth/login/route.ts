import { NextRequest, NextResponse } from 'next/server';
import { BACKEND_API_URL } from '@/lib/api/backend';
import { setAuthCookies } from '@/lib/api/proxy';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const response = await fetch(`${BACKEND_API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    const resp = NextResponse.json({
      success: data.success,
      data: {
        user: {
          id: data.data.user.id,
          email: data.data.user.email,
          firstName: data.data.user.firstName,
          lastName: data.data.user.lastName,
          role: 'employee', // real role/permissions come from /api/auth/me
          permissions: [],
        },
      },
    });

    // httpOnly cookies: access token (15m) + rotating refresh token (7d).
    setAuthCookies(resp, data.data.accessToken, data.data.refreshToken);

    return resp;
  } catch {
    return NextResponse.json(
      { success: false, error: { message: 'Login failed' } },
      { status: 500 }
    );
  }
}
