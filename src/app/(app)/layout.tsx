'use client';

import { useAuth } from '@/lib/auth/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const HomeIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 12l9-9 9 9h-2v7a2 2 0 01-2 2h-10a2 2 0 01-2-2v-7H3z" />
  </svg>
);

const PersonIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2c2.757 0 5 2.243 5 5s-2.243 5-5 5-5-2.243-5-5 2.243-5 5-5zm0 10c3.86 0 7 1.79 7 4v3H5v-3c0-2.21 3.14-4 7-4z" />
  </svg>
);

const InboxIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5.04-6.71l-2.75 3.54-2.83-2.83-1.41 1.41L10.5 17l4.96-6.29-1.46-1.42z" />
  </svg>
);

const TeamIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
  </svg>
);

const CreditCardIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 6h-2.15c-.3-1.23-1.31-2.1-2.85-2.1h-4c-1.54 0-2.55.87-2.85 2.1H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7-2h4c.55 0 1 .45 1 1s-.45 1-1 1h-4c-.55 0-1-.45-1-1s.45-1 1-1z" />
  </svg>
);

const BuildingIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
  </svg>
);

const SparklesIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
  </svg>
);

const ChartIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 9.5c0 .83-.67 1.5-1.5 1.5S11 13.33 11 12.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5zm3-4c0 .83-.67 1.5-1.5 1.5S15 9.33 15 8.5 15.67 7 16.5 7 18 7.67 18 8.5z" />
  </svg>
);

const navItems = [
  { id: 'home', label: 'Home', icon: HomeIcon, href: '/', roles: ['admin', 'employee', 'manager'] },
  { id: 'me', label: 'Me', icon: PersonIcon, href: '/profile', roles: ['admin', 'employee', 'manager'] },
  { id: 'inbox', label: 'Inbox', icon: InboxIcon, href: '/inbox', badge: 5, roles: ['admin', 'employee', 'manager'] },
  { id: 'team', label: 'My Team', icon: TeamIcon, href: '/team', roles: ['manager', 'admin'] },
  { id: 'finances', label: 'My Finances', icon: CreditCardIcon, href: '/payslips', roles: ['admin', 'employee', 'manager'] },
  { id: 'org', label: 'Org', icon: BuildingIcon, href: '/employees', roles: ['admin'] },
  { id: 'engage', label: 'Engage', icon: SparklesIcon, href: '/engage', roles: ['admin', 'employee', 'manager'] },
  { id: 'perf', label: 'Perf', icon: ChartIcon, href: '/performance', roles: ['admin', 'employee', 'manager'] },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const filteredNavItems = navItems.filter((item) => {
    if (!user) return false;
    return item.roles.includes(user.role);
  });

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-24 bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900 text-white flex flex-col items-center py-8 space-y-6">
        {/* User Avatar at Top */}
        <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-lg">
          {user?.firstName?.charAt(0) || 'E'}
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col flex-1 space-y-4 items-center w-full">
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.id}
                href={item.href}
                className="flex flex-col items-center gap-2 text-slate-400 hover:text-white transition-colors group relative"
              >
                <div className="relative">
                  <div className="w-8 h-8 flex items-center justify-center">
                    <Icon />
                  </div>
                  {item.badge && (
                    <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                      {item.badge}
                    </div>
                  )}
                </div>
                <span className="text-xs font-medium text-center whitespace-nowrap px-2">
                  {item.label}
                </span>
              </a>
            );
          })}
        </nav>

        {/* Logout Button at Bottom */}
        <button
          onClick={async () => {
            await user && user.length > 0;
            const router = useRouter ? null : null;
            await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
            window.location.href = '/login';
          }}
          className="flex flex-col items-center gap-2 text-slate-400 hover:text-white transition-colors cursor-pointer"
          title="Logout"
        >
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
          </svg>
          <span className="text-xs font-medium text-center">Logout</span>
        </button>
      </div>

      <div className="flex-1 flex flex-col overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
