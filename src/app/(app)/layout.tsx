'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth/useAuth';
import { useRouter, usePathname } from 'next/navigation';
import { ProfileDropdown } from '@/components/ProfileDropdown';
import {
  HomeIcon,
  InboxIcon,
  TeamIcon,
  WalletIcon,
  TimerIcon,
  CalendarCheckIcon,
  CalendarIcon,
  TrendingUpIcon,
  MessageCircleIcon,
  GridIcon,
  SettingsIcon,
  HelpIcon,
  ChevronDownIcon,
  MenuIcon,
  XIcon,
  PanelLeftCloseIcon,
  PanelLeftOpenIcon,
  SearchIcon,
  BellIcon,
  FingerprintIcon,
} from '@/components/icons';

type RequiredRole = 'admin' | 'employee' | 'manager';

const roleLabels: Record<RequiredRole, string> = {
  admin: 'HR Administrator',
  manager: 'Manager',
  employee: 'Employee',
};

function roleLabel(role?: string) {
  return roleLabels[role as RequiredRole] || 'Employee';
}

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
  { id: 'attendance', label: 'Attendance', icon: CalendarCheckIcon, href: '/attendance', roles: ['admin', 'employee', 'manager'] },
  { id: 'leave', label: 'Leave Management', icon: CalendarIcon, href: '/leave', roles: ['admin', 'employee', 'manager'] },
  { id: 'timesheet', label: 'Timesheet', icon: TimerIcon, href: '/timesheet', roles: ['admin', 'employee', 'manager'] },
  {
    id: 'finances',
    label: 'My Finances',
    icon: WalletIcon,
    href: '/payslips',
    roles: ['admin', 'employee', 'manager'],
    children: [
      { label: 'Summary', href: '/payslips?tab=summary' },
      { label: 'My Pay', href: '/payslips?tab=pay' },
      { label: 'Manage Tax', href: '/payslips?tab=tax' },
      { label: 'Expenses & Travel', href: '/payslips?tab=expenses' },
    ],
  },
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
  { id: 'team', label: 'My Team', icon: TeamIcon, href: '/team', roles: ['admin', 'employee', 'manager'] },
  { id: 'org', label: 'Organization', icon: TeamIcon, href: '/employees', roles: ['admin'] },
  { id: 'engage', label: 'Engage', icon: MessageCircleIcon, href: '/engage', roles: ['admin', 'employee', 'manager'] },
  { id: 'apps', label: 'Apps', icon: GridIcon, href: '/apps', roles: ['admin', 'employee', 'manager'] },
];

const COLLAPSE_STORAGE_KEY = 'hrms-sidebar-collapsed';

const pageTitles: Record<string, { title: string; subtitle?: string }> = {
  '/': { title: 'Home', subtitle: 'Overview of your workday and organization updates' },
  '/inbox': { title: 'Inbox', subtitle: 'Review messages, requests, and notifications that need your attention' },
  '/me/attendance': { title: 'Attendance', subtitle: 'Track your attendance, timings, and attendance requests' },
  '/leave': { title: 'Leave Management', subtitle: 'View your leave balance, requests, and time off' },
  '/timesheet': { title: 'Timesheet', subtitle: 'Track logged hours across projects and categories' },
  '/team': { title: 'My Team', subtitle: 'View your team, schedules, and workplace activity' },
  '/employees': { title: 'Organization', subtitle: 'Manage employees and organizational documents' },
  '/settings': { title: 'Settings', subtitle: 'Manage your account preferences' },
  '/help': { title: 'Help & Support', subtitle: 'Find answers to common questions' },
  '/performance': { title: 'Performance', subtitle: 'Track reviews, goals, feedback, and career development' },
  '/payslips': { title: 'My Finances', subtitle: 'View your payslips, salary, taxes, and expenses' },
  '/me': { title: 'Me', subtitle: 'Access your personal information and records' },
  '/engage': { title: 'Engage', subtitle: 'Connect with colleagues and stay updated with your organization' },
  '/calendar': { title: 'Calendar', subtitle: 'Upcoming company events and holidays' },
  '/apps': { title: 'Apps', subtitle: 'Access the tools and applications available to you' },
  '/reports': { title: 'Reports', subtitle: 'Headcount, attendance, leave, and payroll analytics' },
  '/learning': { title: 'Learning', subtitle: 'Courses, certifications, and skill-building resources' },
  '/career': { title: 'Career', subtitle: 'Growth plans, internal mobility, and career conversations' },
};

function getPageTitle(pathname: string) {
  if (pathname === '/') return pageTitles['/'];
  const match = Object.keys(pageTitles)
    .filter((key) => key !== '/' && pathname.startsWith(key))
    .sort((a, b) => b.length - a.length)[0];
  return match ? pageTitles[match] : null;
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isAuthenticated } = useAuth();
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

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  const currentPageTitle = getPageTitle(pathname);

  const renderNavLink = (item: NavItem) => {
    const Icon = item.icon;
    const active = isActive(item.href);
    const hasChildren = !!item.children?.length;
    const expanded = expandedId === item.id;

    return (
      <div key={item.id} className="group/nav relative">
        <a
          href={item.href}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors relative ${
            collapsed ? 'md:justify-center md:px-0' : ''
          } ${active ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
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
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setExpandedId(expanded ? null : item.id);
              }}
              aria-label={expanded ? `Collapse ${item.label}` : `Expand ${item.label}`}
              aria-expanded={expanded}
              className={`-my-1 -mr-1 p-1 rounded-md hover:bg-white/10 transition-colors ${collapsed ? 'md:hidden' : ''}`}
            >
              <ChevronDownIcon
                className={`w-4 h-4 shrink-0 transition-transform ${expanded ? 'rotate-180' : ''}`}
              />
            </button>
          ) : null}
        </a>

        {/* Collapsed-state tooltip */}
        {collapsed ? (
          <span className="hidden md:group-hover/nav:block absolute left-full top-1/2 -translate-y-1/2 ml-2 z-50 whitespace-nowrap rounded-md bg-slate-800 text-white text-xs font-medium px-2.5 py-1.5 shadow-lg pointer-events-none">
            {item.label}
          </span>
        ) : null}

        {hasChildren && expanded && !collapsed ? (
          <div className="mt-1 ml-8 space-y-0.5 border-l border-slate-700 pl-3">
            {item.children!.map((child) => (
              <a
                key={child.label}
                href={child.href}
                className="block px-2 py-1.5 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
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
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white font-bold text-lg shrink-0">
          H
        </div>
        <span className={`text-white font-bold text-lg tracking-tight truncate ${collapsed ? 'md:hidden' : ''}`}>
          HRMS Portal
        </span>
        <button
          onClick={() => setIsMobileNavOpen(false)}
          className="ml-auto md:hidden text-slate-300 hover:text-white p-1"
          aria-label="Close navigation"
        >
          <XIcon className="w-5 h-5" />
        </button>
      </div>

      <div className={`hidden md:flex px-5 pb-4 ${collapsed ? 'md:justify-center md:px-0' : 'justify-end'}`}>
        <button
          onClick={toggleCollapsed}
          className="text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg p-1.5 transition-colors"
          aria-label={collapsed ? 'Expand navigation' : 'Collapse navigation'}
          title={collapsed ? 'Expand navigation' : 'Collapse navigation'}
        >
          {collapsed ? <PanelLeftOpenIcon className="w-[18px] h-[18px]" /> : <PanelLeftCloseIcon className="w-[18px] h-[18px]" />}
        </button>
      </div>

      <nav className="flex-1 min-h-0 px-3 space-y-1 overflow-y-auto scrollbar-hide">
        {filteredNavItems.map(renderNavLink)}
      </nav>

      <div className="px-3 pt-3 mt-3 border-t border-slate-800 shrink-0">
        <div className={`flex items-center gap-2 px-2 py-2 ${collapsed ? 'md:justify-center md:px-0' : ''}`}>
          <div className="relative shrink-0">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center font-bold text-sm text-white">
              {user?.firstName?.charAt(0) || 'E'}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#0F172A]" />
          </div>
          <div className={`flex-1 min-w-0 ${collapsed ? 'md:hidden' : ''}`}>
            <div className="text-sm font-semibold text-white truncate">
              {user?.firstName} {user?.lastName}
            </div>
            <div className="text-xs text-slate-400 truncate">{roleLabel(user?.role)}</div>
          </div>
          <button
            onClick={() => router.push('/settings')}
            aria-label="Account settings"
            title="Account settings"
            className={`shrink-0 text-slate-400 hover:text-white transition-colors ${collapsed ? 'md:hidden' : ''}`}
          >
            <SettingsIcon className="w-[18px] h-[18px]" />
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-[#faf8ff] overflow-hidden">
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 flex items-center gap-3 bg-white border-b border-slate-200 px-4 py-3">
        <button onClick={() => setIsMobileNavOpen(true)} className="text-slate-700 p-1" aria-label="Open navigation">
          <MenuIcon className="w-6 h-6" />
        </button>
        <span className="text-slate-900 font-bold">HRMS Portal</span>
      </div>

      {/* Mobile drawer overlay */}
      {isMobileNavOpen ? (
        <div className="md:hidden fixed inset-0 bg-black/40 z-40" onClick={() => setIsMobileNavOpen(false)} />
      ) : null}

      {/* Sidebar */}
      <aside
        className={`w-52 ${
          collapsed ? 'md:w-14' : 'md:w-52'
        } shrink-0 bg-[#0F172A] flex flex-col py-6 fixed md:static inset-y-0 left-0 z-50 transition-[width,transform] duration-200 ease-in-out overflow-hidden ${
          isMobileNavOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {sidebarContent}
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden pt-14 md:pt-0 min-w-0">
        {/* Shared top bar, visible on every page */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4 shrink-0">
          {currentPageTitle ? (
            <div className="min-w-0 shrink-0">
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight truncate">{currentPageTitle.title}</h1>
              {currentPageTitle.subtitle ? (
                <p className="text-xs text-slate-500 truncate hidden sm:block">{currentPageTitle.subtitle}</p>
              ) : null}
            </div>
          ) : null}

          <div className="flex-1 max-w-md">
            <div className="relative">
              <input
                type="text"
                placeholder="Search employees, docs, claims, leaves..."
                className="w-full pl-4 pr-10 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:border-slate-300 focus:ring-2 focus:ring-indigo-500/10 transition-all"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hidden sm:flex items-center gap-1">
                <SearchIcon className="w-4 h-4" />
                <kbd className="text-[10px] font-semibold border border-slate-200 rounded px-1 py-0.5">⌘K</kbd>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => router.push('/help')}
              className="p-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              title="Help"
            >
              <HelpIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => router.push('/attendance')}
              className="shrink-0 flex items-center gap-2 pl-3 pr-4 py-2.5 rounded-full border border-indigo-200 text-indigo-600 text-sm font-semibold hover:bg-indigo-50 transition-colors"
              title="Quick Check In"
            >
              <FingerprintIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Quick Check In</span>
            </button>
            <button
              onClick={() => router.push('/notifications')}
              className="relative p-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              title="Notifications"
            >
              <BellIcon className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-4 h-4 flex items-center justify-center rounded-full bg-red-500 text-white text-[9px] font-bold">
                4
              </span>
            </button>
            <div className="pl-2 sm:pl-3 border-l border-slate-200">
              <ProfileDropdown />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
