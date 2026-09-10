import { NextRequest, NextResponse } from 'next/server';
import { proxyToBackend, clearAuthCookies, setAuthCookies } from '@/lib/api/proxy';

function unauthorized() {
  const resp = NextResponse.json(
    { success: false, error: { message: 'Unauthorized' } },
    { status: 401 }
  );
  clearAuthCookies(resp);
  return resp;
}

/** The caller's own extended (ESS) employee profile. */
export async function GET(req: NextRequest) {
  try {
    const { status, body, rotated, sessionExpired } = await proxyToBackend(req, '/ess/profile');

    if (sessionExpired || status === 401) {
      return unauthorized();
    }

    const resp = NextResponse.json(
      body ?? { success: false, error: { message: 'Failed to load profile' } },
      { status: status || 502 }
    );

    if (rotated) {
      setAuthCookies(resp, rotated.accessToken, rotated.refreshToken);
    }

    return resp;
  } catch (err) {
    console.error('[api/ess/profile] GET failed:', err);
    return NextResponse.json(
      { success: false, error: { message: 'Failed to load profile' } },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const payload = await req.json();
    const { status, body, rotated, sessionExpired } = await proxyToBackend(req, '/ess/profile', {
      method: 'PUT',
      body: JSON.stringify(payload),
    });

    if (sessionExpired || status === 401) {
      return unauthorized();
    }

    const resp = NextResponse.json(
      body ?? { success: false, error: { message: 'Failed to update profile' } },
      { status: status || 502 }
    );

    if (rotated) {
      setAuthCookies(resp, rotated.accessToken, rotated.refreshToken);
    }

    return resp;
  } catch (err) {
    console.error('[api/ess/profile] PUT failed:', err);
    return NextResponse.json(
      { success: false, error: { message: 'Failed to update profile' } },
      { status: 500 }
    );
  }
}
