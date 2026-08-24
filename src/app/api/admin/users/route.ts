import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/admin/users - List users (proxied to backend)
 * Forwards to: GET /api/v1/admin/users
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const backendUrl = new URL(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/v1/admin/users`);

    // Forward query parameters
    searchParams.forEach((value, key) => {
      backendUrl.searchParams.append(key, value);
    });

    // Get auth token from cookies
    const authToken = request.cookies.get('accessToken')?.value;

    const response = await fetch(backendUrl.toString(), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: 'Failed to fetch users' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/users - Create user (proxied to backend)
 * Forwards to: POST /api/v1/admin/users
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const authToken = request.cookies.get('accessToken')?.value;

    const backendUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/v1/admin/users`;

    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { success: false, error: errorData.error || 'Failed to create user' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
