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
    if (!isLoading && user) {
      const isAdmin = user.roles?.some((r: any) => r.name === 'Super Admin' || r.name === 'Admin');
      if (!isAdmin) {
        router.push('/me');
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

  const isAdmin = user?.roles?.some((r: any) => r.name === 'Super Admin' || r.name === 'Admin');

  if (!isAdmin) {
    return null;
  }

  return <>{children}</>;
}
