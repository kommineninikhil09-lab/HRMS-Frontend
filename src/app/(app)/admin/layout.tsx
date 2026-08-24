'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/useAuth';
import { useEffect } from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Check if user has admin role
    if (!isLoading && user) {
      const isAdmin = user.role === 'admin';

      if (!isAdmin) {
        router.push('/me'); // Redirect non-admins to Me page
      }
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  const isAdmin = user?.role === 'admin';

  if (!isAdmin) {
    return null;
  }

  return <>{children}</>;
}
