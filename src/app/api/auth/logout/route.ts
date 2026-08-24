import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('accessToken')?.value;

    if (token) {
      // Forward to backend API to revoke token
      await fetch('http://localhost:3000/api/v1/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
    }

    // Clear httpOnly cookie
    const resp = NextResponse.json({ success: true });
    resp.cookies.delete('accessToken');
    return resp;
  } catch (error) {
    return NextResponse.json(
      { success: false, error: { message: 'Logout failed' } },
      { status: 500 }
    );
  }
}
