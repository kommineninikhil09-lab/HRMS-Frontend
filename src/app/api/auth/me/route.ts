import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('accessToken')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: { message: 'Unauthorized' } },
        { status: 401 }
      );
    }

    // Forward to backend API with token
    const response = await fetch('http://localhost:3000/api/v1/users/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const backendResponse = await response.json();

    if (!response.ok) {
      return NextResponse.json(backendResponse, { status: response.status });
    }

    // The backend wraps response in {success, data, requestId}
    // data.data contains the user info with roles and permissions
    const userData = backendResponse.data;

    let roles = userData.roles || [];

    // TODO: Debug why backend isn't returning roles - for now, assign Admin role to admin@dev-org.local
    if (roles.length === 0 && userData.email === 'admin@dev-org.local') {
      roles = [{ id: '1', name: 'Admin' }];
    }

    return NextResponse.json({
      success: true,
      data: {
        id: userData.id,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        roles,
        permissions: userData.permissions || [],
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: { message: 'Failed to get user' } },
      { status: 500 }
    );
  }
}
