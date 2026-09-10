import { NextRequest, NextResponse } from 'next/server';
import { proxyToBackend, clearAuthCookies, setAuthCookies } from '@/lib/api/proxy';

/** The caller's own attendance history for a window (?month= or ?from=&to=). */
export async function GET(req: NextRequest) {
  try {
    const { status, body, rotated, sessionExpired } = await proxyToBackend(
      req,
      `/attendance${req.nextUrl.search}`
    );

    if (sessionExpired || status === 401) {
      const resp = NextResponse.json(
        { success: false, error: { message: 'Unauthorized' } },
        { status: 401 }
      );
      clearAuthCookies(resp);
      return resp;
    }

    const resp = NextResponse.json(
      body ?? { success: false, error: { message: 'Failed to load attendance history' } },
      { status: status || 502 }
    );

    if (rotated) {
      setAuthCookies(resp, rotated.accessToken, rotated.refreshToken);
    }

    return resp;
  } catch (err) {
    console.error('[api/attendance] failed:', err);
    return NextResponse.json(
      { success: false, error: { message: 'Failed to load attendance history' } },
      { status: 500 }
    );
  }
}
