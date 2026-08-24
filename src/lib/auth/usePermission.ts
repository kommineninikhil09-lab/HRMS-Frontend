import { useAuth } from './useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export type RequiredRole = 'admin' | 'manager' | 'employee';

export function usePermission(requiredRoles: RequiredRole[]) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (!user || !requiredRoles.includes(user.role as RequiredRole)) {
      router.push('/');
    }
  }, [user, isLoading, requiredRoles, router]);

  return {
    hasAccess: user && requiredRoles.includes(user.role as RequiredRole),
    isLoading,
    user,
  };
}
