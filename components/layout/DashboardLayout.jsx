'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useSession, signOut } from 'next-auth/react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/components/providers/ThemeProvider';
import {
  LayoutDashboard, Package, Plus, BarChart2, QrCode, Settings,
  Heart, Bell, Users, Store, LogOut, Menu, X, Sun, Moon, Shield,
  Flag, User,
} from 'lucide-react';

const MERCHANT_NAV = [
  { href: '/dashboard/merchant',           icon: LayoutDashboard, label: 'Tableau de bord' },
  { href: '/dashboard/merchant/offers',    icon: Package,         label: 'Mes offres' },
  { href: '/dashboard/merchant/create',    icon: Plus,            label: 'Créer une offre' },
  { href: '/dashboard/merchant/profile',   icon: Store,           label: 'Mon profil' },
  { href: '/dashboard/merchant/stats',     icon: BarChart2,       label: 'Statistiques' },
  { href: '/dashboard/merchant/qrcode',    icon: QrCode,          label: 'QR Code PDF' },
  { href: '/dashboard/merchant/settings',  icon: Settings,        label: 'Paramètres' },
];

const CLIENT_NAV = [
  { href: '/dashboard/client',                      icon: LayoutDashboard, label: 'Tableau de bord' },
  { href: '/dashboard/client/favorites',            icon: Heart,           label: 'Favoris' },
  { href: '/dashboard/client/following',            icon: Users,           label: 'Abonnements' },
  { href: '/dashboard/client/notifications',        icon: Bell,            label: 'Notifications' },
  { href: '/dashboard/client/profile',              icon: User,            label: 'Profil' },
  { href: '/dashboard/client/settings',             icon: Settings,        label: 'Paramètres' },
];

const ADMIN_NAV = [
  { href: '/dashboard/admin',            icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/dashboard/admin/users',      icon: Users,           label: 'Utilisateurs' },
  { href: '/dashboard/admin/merchants',  icon: Store,           label: 'Commerçants' },
  { href: '/dashboard/admin/offers',     icon: Package,         label: 'Offres' },
  { href: '/dashboard/admin/reports',    icon: Flag,            label: 'Signalements' },
  { href: '/dashboard/admin/stats',      icon: BarChart2,       label: 'Statistiques' },
  { href: '/dashboard/admin/settings',   icon: Settings,        label: 'Paramètres' },
];

export default function DashboardLayout({ children }) {
  const { data: session }      = useSession();
  const locale                  = useLocale();
  const pathname                = usePathname();
  const { theme, toggleTheme }  = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const role  = session?.user?.role;
  const navItems = role === 'admin' ? ADMIN_NAV : role === 'merchant' ? MERCHANT_NAV : CLIENT_NAV;

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-950">
      {/* Sidebar */}
      <aside className={cn(
        'fixed inset-y-0 start-0 z-50 w-64 bg-white dark:bg-gray-900 border-e border-gray-100 dark:border-gray-800 flex flex-col transition-transform duration-300',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      )}>
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-100 dark:border-gray-800">
          <Link href={`/${locale}`} className="flex items-center gap-2 font-bold">
            <span className="bg-primary-500 text-white px-2 py-0.5 rounded text-sm font-extrabold">SA</span>
            <span className="text-gray-900 dark:text-white">StockAlerte</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden p-1 rounded hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User info */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            {session?.user?.image ? (
              <img src={session.user.image} alt="" className="w-9 h-9 rounded-full object-cover" />
            ) : (
              <div className="w-9 h-9 rounded-full bg-primary-500 flex items-center justify-center text-white font-semibold text-sm">
                {session?.user?.name?.[0]?.toUpperCase()}
              </div>
            )}
            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate">{session?.user?.name}</p>
              <p className="text-xs text-gray-500 truncate capitalize">{role}</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-1">
          {navItems.map(({ href, icon: Icon, label }) => {
            const fullHref = `/${locale}${href}`;
            const active   = pathname === fullHref;
            return (
              <Link
                key={href}
                href={fullHref}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  active
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
                )}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Footer actions */}
        <div className="px-3 py-4 border-t border-gray-100 dark:border-gray-800 space-y-1">
          <button onClick={toggleTheme} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 w-full">
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            {theme === 'dark' ? 'Mode clair' : 'Mode sombre'}
          </button>
          <button
            onClick={() => signOut({ callbackUrl: `/${locale}` })}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 w-full"
          >
            <LogOut className="w-4 h-4" /> Déconnexion
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 md:ms-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-16 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 flex items-center px-4 sm:px-6 gap-4">
          <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1" />
          <Link href={`/${locale}`} className="text-sm text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
            ← Retour au site
          </Link>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
