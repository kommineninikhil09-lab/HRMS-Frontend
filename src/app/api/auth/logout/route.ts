import { NextRequest, NextResponse } from 'next/server';
import { BACKEND_API_URL } from '@/lib/api/backend';
import { clearAuthCookies } from '@/lib/api/proxy';

export async function POST(req: NextRequest) {
  const refreshToken = req.cookies.get('refreshToken')?.value;

  if (refreshToken) {
    // Revoke the refresh token server-side. Best-effort — never block logout on it.
    try {
      await fetch(`${BACKEND_API_URL}/auth/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });
    } catch {
      // ignore
    }
  }

  const resp = NextResponse.json({ success: true });
  clearAuthCookies(resp);
  return resp;
}
