'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Truck, LayoutDashboard, Users, Package, FileText, UserCircle, Receipt, BarChart3, Menu, X, Sun, Moon, Monitor } from 'lucide-react';
import { useState } from 'react';
import clsx from 'clsx';
import { useTheme } from '@/components/ThemeProvider';

const navItems = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard },
  { label: 'Trucks', href: '/trucks', icon: Truck },
  { label: 'Drivers', href: '/drivers', icon: Users },
  { label: 'Customers', href: '/customers', icon: UserCircle },
  { label: 'Loads', href: '/loads', icon: Package },
  { label: 'Dispatching', href: '/dispatching', icon: FileText },
  { label: 'Invoices', href: '/invoices', icon: Receipt },
  { label: 'Reports', href: '/reports', icon: BarChart3 },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-card border border-border rounded-lg shadow-sm"
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/30 z-30" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={clsx(
        'fixed lg:static inset-y-0 left-0 z-40 w-64 bg-card border-r border-border flex flex-col transform transition-transform duration-200',
        mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}>
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-border">
          <Truck className="text-primary mr-3" size={28} />
          <div>
            <h1 className="font-bold text-lg text-card-foreground tracking-tight">TruckLog</h1>
            <p className="text-xs text-muted-foreground">Logistics Management</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={clsx(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <item.icon size={20} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Theme Selector */}
        <div className="p-4 border-t border-border">
          <div className="inline-flex bg-muted rounded-lg p-1">
            <button
              onClick={() => setTheme('light')}
              className={clsx(
                'p-1.5 rounded-md transition-colors',
                theme === 'light' ? 'bg-card text-card-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              )}
              title="Light theme"
            >
              <Sun size={16} />
            </button>
            <button
              onClick={() => setTheme('system')}
              className={clsx(
                'p-1.5 rounded-md transition-colors',
                theme === 'system' ? 'bg-card text-card-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              )}
              title="System theme"
            >
              <Monitor size={16} />
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={clsx(
                'p-1.5 rounded-md transition-colors',
                theme === 'dark' ? 'bg-card text-card-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              )}
              title="Dark theme"
            >
              <Moon size={16} />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-muted/50">
            <div className="relative">
              <div className="w-2.5 h-2.5 rounded-full bg-success" />
              <div className="absolute -inset-0.5 rounded-full bg-success/40 animate-ping" />
            </div>
            <span className="text-xs font-medium text-muted-foreground">System Online</span>
          </div>
        </div>
      </aside>
    </>
  );
}