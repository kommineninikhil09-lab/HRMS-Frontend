import { NextRequest, NextResponse } from 'next/server';
import { BACKEND_API_URL } from '@/lib/api/backend';
import { setAuthCookies, clearAuthCookies } from '@/lib/api/proxy';

/**
 * Exchange the refresh cookie for a fresh token pair and re-set both cookies.
 * The route handlers refresh transparently on 401, so a client rarely needs to
 * call this directly — it's here for an explicit "keep me signed in" nudge.
 */
export async function POST(req: NextRequest) {
  const refreshToken = req.cookies.get('refreshToken')?.value;

  if (!refreshToken) {
    const resp = NextResponse.json(
      { success: false, error: { message: 'No session' } },
      { status: 401 }
    );
    clearAuthCookies(resp);
    return resp;
  }

  try {
    const r = await fetch(`${BACKEND_API_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (!r.ok) {
      const resp = NextResponse.json(
        { success: false, error: { message: 'Session expired' } },
        { status: 401 }
      );
      clearAuthCookies(resp);
      return resp;
    }

    const data = await r.json();
    const resp = NextResponse.json({ success: true });
    setAuthCookies(resp, data.data.accessToken, data.data.refreshToken);
    return resp;
  } catch {
    return NextResponse.json(
      { success: false, error: { message: 'Refresh failed' } },
      { status: 500 }
    );
  }
}
