import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    // Forward to backend API
    const response = await fetch('http://localhost:3000/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    // Set httpOnly cookie with access token
    const resp = NextResponse.json({
      success: data.success,
      data: {
        accessToken: data.data.accessToken,
        refreshToken: data.data.refreshToken,
        user: {
          id: data.data.user.id,
          email: data.data.user.email,
          firstName: data.data.user.firstName,
          lastName: data.data.user.lastName,
          role: 'employee', // Will be fetched from /me endpoint
          permissions: [],
        },
      },
    });

    resp.cookies.set({
      name: 'accessToken',
      value: data.data.accessToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60, // 15 minutes
    });

    return resp;
  } catch (error) {
    return NextResponse.json(
      { success: false, error: { message: 'Login failed' } },
      { status: 500 }
    );
  }
}
