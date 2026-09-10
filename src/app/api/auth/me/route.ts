import { NextRequest, NextResponse } from 'next/server';
import { proxyToBackend, setAuthCookies, clearAuthCookies } from '@/lib/api/proxy';

const roleMapping: Record<string, string> = {
  admin: 'admin',
  Admin: 'admin',
  ADMIN: 'admin',
  'super admin': 'admin',
  'Super Admin': 'admin',
  SUPER_ADMIN: 'admin',
  manager: 'manager',
  Manager: 'manager',
  MANAGER: 'manager',
  'hr manager': 'manager',
  'HR Manager': 'manager',
  HR_MANAGER: 'manager',
  employee: 'employee',
  Employee: 'employee',
  EMPLOYEE: 'employee',
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
    const backendRole = u.roles?.[0]?.name || 'employee';
    const role =
      roleMapping[backendRole] ||
      backendRole.toLowerCase().replace(/\s+/g, '').replace(/^hr/, '') ||
      'employee';

    const resp = NextResponse.json({
      success: true,
      data: {
        id: u.id,
        email: u.email,
        firstName: u.firstName,
        lastName: u.lastName,
        role,
        permissions: u.permissions || [],
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
