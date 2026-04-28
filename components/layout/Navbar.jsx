'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useTranslations, useLocale } from 'next-intl';
import { useTheme } from '@/components/providers/ThemeProvider';
import {
  Bell, Map, Menu, X, Sun, Moon, Globe, LogOut,
  LayoutDashboard, ChevronDown, Store, Leaf,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const LOCALES = [
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'en', label: 'English',  flag: '🇬🇧' },
  { code: 'ar', label: 'العربية',  flag: '🇩🇿' },
];

export default function Navbar() {
  const t                 = useTranslations('nav');
  const locale            = useLocale();
  const { data: session } = useSession();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen]         = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [scrolled, setScrolled]         = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const dashboardPath = session?.user?.role === 'merchant'
    ? `/${locale}/dashboard/merchant`
    : `/${locale}/dashboard/client`;

  return (
    <header className={cn(
      'sticky top-0 z-50 transition-all duration-300',
      scrolled
        ? 'bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl shadow-sm border-b border-gray-100 dark:border-gray-800'
        : 'bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800'
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2.5 group">
            <div className="bg-primary-500 text-white w-9 h-9 rounded-xl flex items-center justify-center shadow-green group-hover:scale-105 transition-transform duration-200">
              <Leaf className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-lg text-gray-900 dark:text-white hidden sm:block tracking-tight">
              Stock<span className="text-primary-500">Alerte</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            <Link href={`/${locale}`} className="btn-ghost text-sm">{t('home')}</Link>
            <Link href={`/${locale}/discover`} className="btn-ghost text-sm">{t('discover')}</Link>
            <Link href={`/${locale}/map`} className="btn-ghost text-sm flex items-center gap-1.5">
              <Map className="w-4 h-4" />{t('map')}
            </Link>
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-1">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-500 dark:text-gray-400"
            >
              {theme === 'dark' ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
            </button>

            <div className="relative">
              <button
                onClick={() => { setLangMenuOpen((v) => !v); setUserMenuOpen(false); }}
                className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center gap-1 text-gray-500 dark:text-gray-400"
              >
                <Globe className="w-[18px] h-[18px]" />
                <span className="text-xs font-semibold hidden sm:block uppercase">{locale}</span>
              </button>
              {langMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setLangMenuOpen(false)} />
                  <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-gray-900 rounded-2xl shadow-card-hover border border-gray-100 dark:border-gray-800 py-1.5 z-50">
                    {LOCALES.map((l) => (
                      <Link key={l.code} href={`/${l.code}`} onClick={() => setLangMenuOpen(false)}
                        className={cn(
                          'flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors',
                          l.code === locale ? 'text-primary-600 font-semibold' : 'text-gray-700 dark:text-gray-300'
                        )}
                      >
                        <span>{l.flag}</span>
                        <span>{l.label}</span>
                        {l.code === locale && <span className="ms-auto w-2 h-2 rounded-full bg-primary-500" />}
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>

            {session ? (
              <>
                <Link href={`/${locale}/dashboard/client/notifications`}
                  className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-500 dark:text-gray-400">
                  <Bell className="w-[18px] h-[18px]" />
                </Link>
                <div className="relative">
                  <button
                    onClick={() => { setUserMenuOpen((v) => !v); setLangMenuOpen(false); }}
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    {session.user.image ? (
                      <img src={session.user.image} alt="" className="w-7 h-7 rounded-full object-cover ring-2 ring-primary-200 dark:ring-primary-800" />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xs font-bold">
                        {session.user.name?.[0]?.toUpperCase()}
                      </div>
                    )}
                    <ChevronDown className={cn('w-3.5 h-3.5 text-gray-400 transition-transform hidden sm:block', userMenuOpen && 'rotate-180')} />
                  </button>
                  {userMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                      <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 rounded-2xl shadow-card-hover border border-gray-100 dark:border-gray-800 z-50 overflow-hidden">
                        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                          <p className="text-sm font-semibold truncate">{session.user.name}</p>
                          <p className="text-xs text-gray-500 truncate mt-0.5">{session.user.email}</p>
                        </div>
                        <div className="py-1.5">
                          <Link href={dashboardPath} onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                            <LayoutDashboard className="w-4 h-4 text-gray-400" /> {t('dashboard')}
                          </Link>
                          {session.user.role === 'merchant' && (
                            <Link href={`/${locale}/dashboard/merchant`} onClick={() => setUserMenuOpen(false)}
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                              <Store className="w-4 h-4 text-gray-400" /> Mon commerce
                            </Link>
                          )}
                        </div>
                        <div className="border-t border-gray-100 dark:border-gray-800 py-1.5">
                          <button onClick={() => signOut({ callbackUrl: `/${locale}` })}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 w-full transition-colors">
                            <LogOut className="w-4 h-4" /> {t('logout')}
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2 ms-1">
                <Link href={`/${locale}/auth/login`} className="btn-ghost text-sm hidden sm:flex py-2">{t('login')}</Link>
                <Link href={`/${locale}/auth/register`} className="btn-primary text-sm py-2 px-5">{t('register')}</Link>
              </div>
            )}

            <button onClick={() => setMenuOpen((v) => !v)}
              className="md:hidden p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden py-3 border-t border-gray-100 dark:border-gray-800 space-y-0.5 pb-4">
            {[
              { href: `/${locale}`, label: t('home') },
              { href: `/${locale}/discover`, label: t('discover') },
              { href: `/${locale}/map`, label: t('map') },
            ].map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)}
                className="block px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">
                {item.label}
              </Link>
            ))}
            {!session && (
              <div className="pt-3 flex gap-2">
                <Link href={`/${locale}/auth/login`} onClick={() => setMenuOpen(false)}
                  className="btn-secondary text-sm flex-1 justify-center py-2.5">{t('login')}</Link>
                <Link href={`/${locale}/auth/register`} onClick={() => setMenuOpen(false)}
                  className="btn-primary text-sm flex-1 justify-center py-2.5">{t('register')}</Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
