'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useTranslations, useLocale } from 'next-intl';
import { useTheme } from '@/components/providers/ThemeProvider';
import {
  Bell, Heart, Map, Search, Menu, X, Sun, Moon, Globe, User, LogOut,
  LayoutDashboard, ChevronDown, Store,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const LOCALES = [
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'en', label: 'English',  flag: '🇬🇧' },
  { code: 'ar', label: 'العربية', flag: '🇩🇿' },
];

export default function Navbar() {
  const t          = useTranslations('nav');
  const locale     = useLocale();
  const { data: session } = useSession();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const dashboardPath = session?.user?.role === 'merchant'
    ? `/${locale}/dashboard/merchant`
    : `/${locale}/dashboard/client`;

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2 font-bold text-xl">
            <span className="bg-primary-500 text-white px-2 py-1 rounded-lg text-sm font-extrabold">SA</span>
            <span className="text-gray-900 dark:text-white hidden sm:block">StockAlerte</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            <Link href={`/${locale}`} className="btn-ghost text-sm px-3 py-2">{t('home')}</Link>
            <Link href={`/${locale}/discover`} className="btn-ghost text-sm px-3 py-2">{t('discover')}</Link>
            <Link href={`/${locale}/map`} className="btn-ghost text-sm px-3 py-2">
              <Map className="w-4 h-4 inline mr-1" />{t('map')}
            </Link>
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">

            {/* Theme */}
            <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Language */}
            <div className="relative">
              <button
                onClick={() => setLangMenuOpen((v) => !v)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center gap-1"
              >
                <Globe className="w-5 h-5" />
                <span className="text-xs hidden sm:block uppercase">{locale}</span>
              </button>
              {langMenuOpen && (
                <div className="absolute right-0 mt-2 w-40 card py-1 shadow-lg z-50">
                  {LOCALES.map((l) => (
                    <Link
                      key={l.code}
                      href={`/${l.code}`}
                      onClick={() => setLangMenuOpen(false)}
                      className={cn(
                        'flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800',
                        l.code === locale && 'text-primary-600 font-medium'
                      )}
                    >
                      <span>{l.flag}</span> {l.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {session ? (
              <>
                {/* Notifications */}
                <Link href={`/${locale}/dashboard/client/notifications`} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 relative">
                  <Bell className="w-5 h-5" />
                </Link>

                {/* User menu */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen((v) => !v)}
                    className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    {session.user.image ? (
                      <img src={session.user.image} alt="" className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white text-sm font-semibold">
                        {session.user.name?.[0]?.toUpperCase()}
                      </div>
                    )}
                    <ChevronDown className="w-4 h-4 hidden sm:block" />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-52 card py-1 shadow-lg z-50">
                      <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800">
                        <p className="text-sm font-medium truncate">{session.user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{session.user.email}</p>
                      </div>
                      <Link href={dashboardPath} onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800">
                        <LayoutDashboard className="w-4 h-4" /> {t('dashboard')}
                      </Link>
                      {session.user.role === 'merchant' && (
                        <Link href={`/${locale}/dashboard/merchant`} onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800">
                          <Store className="w-4 h-4" /> Mon commerce
                        </Link>
                      )}
                      <button
                        onClick={() => signOut({ callbackUrl: `/${locale}` })}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 w-full"
                      >
                        <LogOut className="w-4 h-4" /> {t('logout')}
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link href={`/${locale}/auth/login`} className="btn-ghost text-sm hidden sm:block">
                  {t('login')}
                </Link>
                <Link href={`/${locale}/auth/register`} className="btn-primary text-sm">
                  {t('register')}
                </Link>
              </div>
            )}

            {/* Mobile menu */}
            <button onClick={() => setMenuOpen((v) => !v)} className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {menuOpen && (
          <div className="md:hidden py-3 border-t border-gray-100 dark:border-gray-800 space-y-1">
            <Link href={`/${locale}`} className="block px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-sm" onClick={() => setMenuOpen(false)}>{t('home')}</Link>
            <Link href={`/${locale}/discover`} className="block px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-sm" onClick={() => setMenuOpen(false)}>{t('discover')}</Link>
            <Link href={`/${locale}/map`} className="block px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-sm" onClick={() => setMenuOpen(false)}>{t('map')}</Link>
          </div>
        )}
      </div>
    </header>
  );
}
