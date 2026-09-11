import { NextRequest, NextResponse } from 'next/server';
import { proxyToBackend, setAuthCookies, clearAuthCookies } from '@/lib/api/proxy';

// The backend now guarantees exactly one primary role per user:
// Employee | Admin | Super Admin.
const roleMapping: Record<string, string> = {
  employee: 'employee',
  admin: 'admin',
  'super admin': 'superadmin',
  superadmin: 'superadmin',
};

export async function GET(req: NextRequest) {
  try {
    const { status, body, rotated, sessionExpired } = await proxyToBackend(
      req,
      '/users/me'
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
        body ?? { success: false, error: { message: 'Failed to get user' } },
        { status: status || 502 }
      );
    }

    const u = body.data;
    const backendRole = (u.roles?.[0]?.name || 'employee').toLowerCase();
    const role = roleMapping[backendRole] || 'employee';

    const resp = NextResponse.json({
      success: true,
      data: {
        id: u.id,
        email: u.email,
        firstName: u.firstName,
        lastName: u.lastName,
        role,
        permissions: u.permissions || [],
        // {kind:'org'} / {kind:'team', employeeIds} / {kind:'self'} - the one
        // resolved scope value for this user's requests (see backend P2-04).
        // Falls back to self, matching the backend's own fail-closed default,
        // for callers against an older backend that doesn't send it yet.
        scope: u.scope || { kind: 'self' },
      },
    });

    if (rotated) {
      setAuthCookies(resp, rotated.accessToken, rotated.refreshToken);
    }

    return resp;
  } catch (err) {
    console.error('[api/auth/me] failed:', err);
    return NextResponse.json(
      { success: false, error: { message: 'Failed to get user' } },
      { status: 500 }
    );
  }
}
