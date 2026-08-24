import { useAuth } from './useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export type RequiredRole = 'admin' | 'manager' | 'employee';

export function usePermission(requiredRoles: RequiredRole[]) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const hasRequiredRole = user?.roles?.some(role => requiredRoles.includes(role.name.toLowerCase() as RequiredRole));

  useEffect(() => {
    if (isLoading) return;

    if (!user || !hasRequiredRole) {
      router.push('/');
    }
  }, [user, isLoading, requiredRoles, router, hasRequiredRole]);

  return {
    hasAccess: hasRequiredRole,
    isLoading,
    user,
  };
}
