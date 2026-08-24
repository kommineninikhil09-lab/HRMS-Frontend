'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth/useAuth';
import { useRouter, usePathname } from 'next/navigation';
import {
  HomeIcon,
  InboxIcon,
  TeamIcon,
  WalletIcon,
  TimerIcon,
  CalendarCheckIcon,
  CalendarIcon,
  BriefcaseIcon,
  TrendingUpIcon,
  MessageCircleIcon,
  BarChartIcon,
  GridIcon,
  SettingsIcon,
  HelpIcon,
  ChevronDownIcon,
  MenuIcon,
  XIcon,
  PanelLeftCloseIcon,
  PanelLeftOpenIcon,
  LogoutIcon,
} from '@/components/icons';

type RequiredRole = 'admin' | 'employee' | 'manager';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  roles: RequiredRole[];
  badge?: number;
  children?: { label: string; href: string }[];
}

const navItems: NavItem[] = [
  { id: 'home', label: 'Home', icon: HomeIcon, href: '/', roles: ['admin', 'employee', 'manager'] },
  { id: 'inbox', label: 'Inbox', icon: InboxIcon, href: '/inbox', badge: 5, roles: ['admin', 'employee', 'manager'] },
  { id: 'team', label: 'My Team', icon: TeamIcon, href: '/team', roles: ['manager', 'admin'] },
  { id: 'org', label: 'Employees', icon: TeamIcon, href: '/employees', roles: ['admin'] },
  { id: 'finances', label: 'My Finances', icon: WalletIcon, href: '/payslips', roles: ['admin', 'employee', 'manager'] },
  { id: 'timesheet', label: 'Timesheet', icon: TimerIcon, href: '/timesheet', roles: ['admin', 'employee', 'manager'] },
  { id: 'attendance', label: 'Attendance', icon: CalendarCheckIcon, href: '/attendance', roles: ['admin', 'employee', 'manager'] },
  { id: 'leave', label: 'Leave', icon: CalendarIcon, href: '/leave', roles: ['admin', 'employee', 'manager'] },
  { id: 'expenses', label: 'Expenses & Travel', icon: BriefcaseIcon, href: '/expenses', roles: ['admin', 'employee', 'manager'] },
  {
    id: 'perf',
    label: 'Performance',
    icon: TrendingUpIcon,
    href: '/performance',
    roles: ['admin', 'employee', 'manager'],
    children: [
      { label: 'Performance', href: '/performance' },
      { label: 'Learning', href: '/learning' },
      { label: 'Career', href: '/career' },
    ],
  },
  {
    id: 'engage',
    label: 'Engage',
    icon: MessageCircleIcon,
    href: '/engage',
    roles: ['admin', 'employee', 'manager'],
    children: [
      { label: 'Posts', href: '/engage?tab=post' },
      { label: 'Polls', href: '/engage?tab=poll' },
      { label: 'Praise', href: '/engage?tab=praise' },
    ],
  },
  { id: 'reports', label: 'Reports', icon: BarChartIcon, href: '/reports', roles: ['manager', 'admin'] },
  { id: 'apps', label: 'Apps', icon: GridIcon, href: '/apps', roles: ['admin', 'employee', 'manager'] },
];

const bottomNavItems: NavItem[] = [
  { id: 'settings', label: 'Settings', icon: SettingsIcon, href: '/settings', roles: ['admin', 'employee', 'manager'] },
  { id: 'help', label: 'Help & Support', icon: HelpIcon, href: '/help', roles: ['admin', 'employee', 'manager'] },
];

const COLLAPSE_STORAGE_KEY = 'hrms-sidebar-collapsed';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    setIsMobileNavOpen(false);
  }, [pathname]);

  // Restore the user's collapse preference, defaulting tablet widths to collapsed.
  useEffect(() => {
    const stored = window.localStorage.getItem(COLLAPSE_STORAGE_KEY);
    if (stored !== null) {
      setCollapsed(stored === 'true');
    } else if (window.innerWidth >= 768 && window.innerWidth < 1280) {
      setCollapsed(true);
    }
  }, []);

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev;
      window.localStorage.setItem(COLLAPSE_STORAGE_KEY, String(next));
      return next;
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="text-slate-600">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const filteredNavItems = navItems.filter((item) => !!user && item.roles.includes(user.role as RequiredRole));
  const filteredBottomItems = bottomNavItems.filter((item) => !!user && item.roles.includes(user.role as RequiredRole));

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const renderNavLink = (item: NavItem) => {
    const Icon = item.icon;
    const active = isActive(item.href);
    const hasChildren = !!item.children?.length;
    const expanded = expandedId === item.id;

    return (
      <div key={item.id} className="group/nav relative">
        <a
          href={item.href}
          onClick={(e) => {
            if (hasChildren && !collapsed) {
              e.preventDefault();
              setExpandedId(expanded ? null : item.id);
            }
          }}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors relative ${
            collapsed ? 'md:justify-center md:px-0' : ''
          } ${active ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`}
        >
          <span className="relative shrink-0">
            <Icon className="w-5 h-5" />
            {item.badge && collapsed ? (
              <span className="hidden md:flex absolute -top-1.5 -right-1.5 items-center justify-center rounded-full bg-red-500 text-white text-[9px] font-bold w-4 h-4">
                {item.badge}
              </span>
            ) : null}
          </span>
          <span className={`flex-1 truncate ${collapsed ? 'md:hidden' : ''}`}>{item.label}</span>
          {item.badge ? (
            <span
              className={`${
                collapsed ? 'md:hidden' : ''
              } w-5 h-5 flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold shrink-0`}
            >
              {item.badge}
            </span>
          ) : null}
          {hasChildren ? (
            <ChevronDownIcon
              className={`w-4 h-4 shrink-0 transition-transform ${expanded ? 'rotate-180' : ''} ${
                collapsed ? 'md:hidden' : ''
              }`}
            />
          ) : null}
        </a>

        {/* Collapsed-state tooltip */}
        {collapsed ? (
          <span className="hidden md:group-hover/nav:block absolute left-full top-1/2 -translate-y-1/2 ml-2 z-50 whitespace-nowrap rounded-md bg-slate-800 text-white text-xs font-medium px-2.5 py-1.5 shadow-lg pointer-events-none">
            {item.label}
          </span>
        ) : null}

        {hasChildren && expanded && !collapsed ? (
          <div className="mt-1 ml-8 space-y-0.5 border-l border-white/10 pl-3">
            {item.children!.map((child) => (
              <a
                key={child.label}
                href={child.href}
                className="block px-2 py-1.5 rounded-md text-sm text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                {child.label}
              </a>
            ))}
          </div>
        ) : null}
      </div>
    );
  };

  const sidebarContent = (
    <>
      <div className={`flex items-center gap-3 px-5 pb-4 ${collapsed ? 'md:justify-center md:px-0' : ''}`}>
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white font-bold text-lg shrink-0">
          H
        </div>
        <span className={`text-white font-bold text-lg tracking-tight truncate ${collapsed ? 'md:hidden' : ''}`}>
          HRMS Portal
        </span>
        <button
          onClick={() => setIsMobileNavOpen(false)}
          className="ml-auto md:hidden text-slate-400 hover:text-white p-1"
          aria-label="Close navigation"
        >
          <XIcon className="w-5 h-5" />
        </button>
      </div>

      <div className={`hidden md:flex px-5 pb-4 ${collapsed ? 'md:justify-center md:px-0' : 'justify-end'}`}>
        <button
          onClick={toggleCollapsed}
          className="text-slate-400 hover:text-white hover:bg-white/10 rounded-lg p-1.5 transition-colors"
          aria-label={collapsed ? 'Expand navigation' : 'Collapse navigation'}
          title={collapsed ? 'Expand navigation' : 'Collapse navigation'}
        >
          {collapsed ? <PanelLeftOpenIcon className="w-[18px] h-[18px]" /> : <PanelLeftCloseIcon className="w-[18px] h-[18px]" />}
        </button>
      </div>

      <nav className="flex-1 min-h-0 px-3 space-y-1 overflow-y-auto scrollbar-hide">
        {filteredNavItems.map(renderNavLink)}
      </nav>

      <div className="px-3 pt-3 mt-3 border-t border-white/10 space-y-1 shrink-0 max-h-[45vh] overflow-y-auto scrollbar-hide">
        {filteredBottomItems.map(renderNavLink)}

        <div className={`flex items-center gap-3 px-3 py-3 mt-2 ${collapsed ? 'md:justify-center md:px-0' : ''}`}>
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-sm text-white shrink-0">
            {user?.firstName?.charAt(0) || 'E'}
          </div>
          <div className={`flex-1 min-w-0 ${collapsed ? 'md:hidden' : ''}`}>
            <div className="text-sm font-semibold text-white truncate">
              {user?.firstName} {user?.lastName}
            </div>
            <button onClick={handleLogout} className="text-xs text-slate-400 hover:text-white transition-colors">
              Logout
            </button>
          </div>
          <button
            onClick={handleLogout}
            aria-label="Logout"
            title="Logout"
            className={`hidden text-slate-400 hover:text-white transition-colors ${collapsed ? 'md:block' : ''}`}
          >
            <LogoutIcon className="w-[18px] h-[18px]" />
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 flex items-center gap-3 bg-slate-900 px-4 py-3">
        <button onClick={() => setIsMobileNavOpen(true)} className="text-white p-1" aria-label="Open navigation">
          <MenuIcon className="w-6 h-6" />
        </button>
        <span className="text-white font-bold">HRMS Portal</span>
      </div>

      {/* Mobile drawer overlay */}
      {isMobileNavOpen ? (
        <div className="md:hidden fixed inset-0 bg-black/40 z-40" onClick={() => setIsMobileNavOpen(false)} />
      ) : null}

      {/* Sidebar */}
      <aside
        className={`w-52 ${
          collapsed ? 'md:w-14' : 'md:w-52'
        } shrink-0 bg-slate-900 flex flex-col py-6 fixed md:static inset-y-0 left-0 z-50 transition-[width,transform] duration-200 ease-in-out overflow-hidden ${
          isMobileNavOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {sidebarContent}
      </aside>

      <div className="flex-1 flex flex-col overflow-y-auto pt-14 md:pt-0 min-w-0">{children}</div>
    </div>
  );
}
