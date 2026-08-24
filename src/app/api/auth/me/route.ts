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

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    // Transform backend response to frontend schema
    // Normalize role name: map backend roles to frontend roles
    const backendRole = data.data.roles?.[0]?.name || 'employee';
    const roleMapping: Record<string, string> = {
      'admin': 'admin',
      'Admin': 'admin',
      'ADMIN': 'admin',
      'manager': 'manager',
      'Manager': 'manager',
      'MANAGER': 'manager',
      'hr manager': 'manager',
      'HR Manager': 'manager',
      'HR_MANAGER': 'manager',
      'employee': 'employee',
      'Employee': 'employee',
      'EMPLOYEE': 'employee',
    };

    const normalizedRole = roleMapping[backendRole] || backendRole.toLowerCase().replace(/\s+/g, '').replace(/^hr/, '') || 'employee';

    const transformedData = {
      success: data.success,
      data: {
        id: data.data.id,
        email: data.data.email,
        firstName: data.data.firstName,
        lastName: data.data.lastName,
        role: normalizedRole,
        permissions: data.data.permissions || [],
      },
    };

    return NextResponse.json(transformedData);
  } catch (error) {
    return NextResponse.json(
      { success: false, error: { message: 'Failed to get user' } },
      { status: 500 }
    );
  }
}
