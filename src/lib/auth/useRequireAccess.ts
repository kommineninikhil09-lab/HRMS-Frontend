import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './useAuth';

export interface RequireAccessOptions {
  /** Backend permission code the user must hold, e.g. 'employee.read'. */
  permission?: string;
  /** Require {kind:'org'} scope - use for sections that must see/act across
   * the whole organization, not just a caller's own team or self. */
  requireOrgScope?: boolean;
}

/**
 * Route guard built on the real GET /me signal (permission codes + resolved
 * scope), not role names - unlike the older usePermission hook. Redirects
 * away from a page the caller can't use; UI hiding (nav items, buttons) is a
 * separate concern using the same hasPermission/hasOrgScope checks from
 * useAuth directly, since a hidden element doesn't need a redirect.
 */
export function useRequireAccess({ permission, requireOrgScope }: RequireAccessOptions) {
  const { user, isLoading, hasPermission, hasOrgScope } = useAuth();
  const router = useRouter();

  const hasAccess =
    !!user &&
    (!permission || hasPermission(permission)) &&
    (!requireOrgScope || hasOrgScope());

  useEffect(() => {
    if (isLoading) return;
    if (!hasAccess) {
      router.push('/');
    }
  }, [hasAccess, isLoading, router]);

  return { hasAccess, isLoading, user };
}
