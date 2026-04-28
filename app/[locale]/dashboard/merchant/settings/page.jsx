'use client';

import { useSession, signOut } from 'next-auth/react';
import { useLocale } from 'next-intl';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useTheme } from '@/components/providers/ThemeProvider';
import { Sun, Moon, Monitor, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

const THEMES  = [{ value: 'light', label: 'Clair', icon: Sun }, { value: 'dark', label: 'Sombre', icon: Moon }, { value: 'system', label: 'Système', icon: Monitor }];
const LOCALES = [{ value: 'fr', label: 'Français', flag: '🇫🇷' }, { value: 'en', label: 'English', flag: '🇬🇧' }, { value: 'ar', label: 'العربية', flag: '🇩🇿' }];

export default function MerchantSettingsPage() {
  const { data: session } = useSession();
  const locale            = useLocale();
  const { theme, toggleTheme } = useTheme();

  return (
    <DashboardLayout>
      <div className="max-w-xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Paramètres</h1>
          <p className="text-gray-500 text-sm mt-1">Personnalisez votre espace</p>
        </div>

        {/* Theme */}
        <div className="card p-6 space-y-4">
          <h2 className="font-semibold text-gray-900 dark:text-white">Apparence</h2>
          <div className="grid grid-cols-3 gap-3">
            {THEMES.map(({ value, label, icon: Icon }) => (
              <button key={value} type="button" onClick={() => { if (theme !== value) toggleTheme(); }}
                className={cn('flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all',
                  theme === value ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                )}>
                <Icon className={cn('w-5 h-5', theme === value ? 'text-primary-600' : 'text-gray-400')} />
                <span className={cn('text-xs font-medium', theme === value ? 'text-primary-600' : 'text-gray-500')}>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Language */}
        <div className="card p-6 space-y-4">
          <h2 className="font-semibold text-gray-900 dark:text-white">Langue</h2>
          <div className="space-y-2">
            {LOCALES.map(({ value, label, flag }) => (
              <a key={value} href={`/${value}/dashboard/merchant/settings`}
                className={cn('flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors', value === locale && 'bg-primary-50 dark:bg-primary-900/20')}>
                <span className="text-2xl">{flag}</span>
                <span className={cn('font-medium text-sm', value === locale && 'text-primary-600')}>{label}</span>
                {value === locale && <span className="ms-auto text-primary-600 text-xs">✓</span>}
              </a>
            ))}
          </div>
        </div>

        {/* Account */}
        <div className="card p-6 space-y-4">
          <h2 className="font-semibold text-gray-900 dark:text-white">Compte</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
              <span className="text-gray-500">Email</span>
              <span className="font-medium">{session?.user?.email}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
              <span className="text-gray-500">Rôle</span>
              <span className="font-medium capitalize">Commerçant</span>
            </div>
          </div>

          <button
            onClick={() => signOut({ callbackUrl: `/${locale}` })}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-red-200 dark:border-red-800 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-sm font-medium"
          >
            <LogOut className="w-4 h-4" /> Se déconnecter
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
