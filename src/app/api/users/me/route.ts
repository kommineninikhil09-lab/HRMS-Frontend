import { NextRequest, NextResponse } from 'next/server';
import { proxyToBackend, setAuthCookies, clearAuthCookies } from '@/lib/api/proxy';

export async function PATCH(req: NextRequest) {
  try {
    const payload = await req.json();

    const { status, body, rotated, sessionExpired } = await proxyToBackend(
      req,
      '/users/me',
      { method: 'PATCH', body: JSON.stringify(payload) }
    );

    if (sessionExpired || status === 401) {
      const resp = NextResponse.json(
        { success: false, error: { message: 'Unauthorized' } },
        { status: 401 }
      );
      clearAuthCookies(resp);
      return resp;
    }

    if (status < 200 || status >= 300 || !body?.data) {
      return NextResponse.json(
        body ?? { success: false, error: { message: 'Failed to update profile' } },
        { status: status || 502 }
      );
    }

    const resp = NextResponse.json({
      success: true,
      data: {
        id: body.data.id,
        email: body.data.email,
        firstName: body.data.firstName,
        lastName: body.data.lastName,
      },
    });

    if (rotated) {
      setAuthCookies(resp, rotated.accessToken, rotated.refreshToken);
    }

    return resp;
  } catch {
    return NextResponse.json(
      { success: false, error: { message: 'Failed to update profile' } },
      { status: 500 }
    );
  }
}
