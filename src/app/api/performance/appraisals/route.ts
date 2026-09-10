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

/** The caller's own performance appraisals. */
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
    const appraisals = await proxyToBackend(
      req,
      `/performance/appraisals?employee_id=${encodeURIComponent(employeeId)}`
    );

    if (appraisals.sessionExpired || appraisals.status === 401) {
      return unauthorized();
    }

    const resp = NextResponse.json(
      appraisals.body ?? { success: false, error: { message: 'Failed to load reviews' } },
      { status: appraisals.status || 502 }
    );

    const rotated = appraisals.rotated ?? profile.rotated;
    if (rotated) {
      setAuthCookies(resp, rotated.accessToken, rotated.refreshToken);
    }

    return resp;
  } catch (err) {
    console.error('[api/performance/appraisals] failed:', err);
    return NextResponse.json(
      { success: false, error: { message: 'Failed to load reviews' } },
      { status: 500 }
    );
  }
}
