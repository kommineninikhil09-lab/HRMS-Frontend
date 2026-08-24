'use client';

import { useAuth } from '@/lib/auth/useAuth';
import { ReactNode } from 'react';

interface PermissionGateProps {
  permission?: string;
  children: ReactNode;
  fallback?: ReactNode;
}

export function PermissionGate({ permission, children, fallback }: PermissionGateProps) {
  const { hasPermission, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return fallback || null;
  }

  if (permission && !hasPermission(permission)) {
    return fallback || null;
  }

  return <>{children}</>;
}
