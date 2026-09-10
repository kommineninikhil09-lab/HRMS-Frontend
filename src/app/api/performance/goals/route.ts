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

/** The caller's own performance goals. */
export async function GET(req: NextRequest) {
  try {
    const profile = await proxyToBackend(req, '/ess/profile');

    if (profile.sessionExpired || profile.status === 401) {
      return unauthorized();
    }
    if (profile.status < 200 || profile.status >= 300 || !profile.body?.data?.id) {
      return NextResponse.json(
        profile.body ?? { success: false, error: { message: 'Failed to resolve employee profile' } },
        { status: profile.status || 502 }
      );
    }

    const employeeId = profile.body.data.id;
    const goals = await proxyToBackend(req, `/performance/employee/${employeeId}/goals`);

    if (goals.sessionExpired || goals.status === 401) {
      return unauthorized();
    }

    const resp = NextResponse.json(
      goals.body ?? { success: false, error: { message: 'Failed to load goals' } },
      { status: goals.status || 502 }
    );

    const rotated = goals.rotated ?? profile.rotated;
    if (rotated) {
      setAuthCookies(resp, rotated.accessToken, rotated.refreshToken);
    }

    return resp;
  } catch (err) {
    console.error('[api/performance/goals] failed:', err);
    return NextResponse.json(
      { success: false, error: { message: 'Failed to load goals' } },
      { status: 500 }
    );
  }
}
