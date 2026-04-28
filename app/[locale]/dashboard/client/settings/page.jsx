'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useTheme } from '@/components/providers/ThemeProvider';
import { Sun, Moon, Monitor, Loader2, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

const THEMES  = [{ value: 'light', label: 'Clair', icon: Sun }, { value: 'dark', label: 'Sombre', icon: Moon }, { value: 'system', label: 'Système', icon: Monitor }];
const LOCALES = [{ value: 'fr', label: 'Français', flag: '🇫🇷' }, { value: 'en', label: 'English', flag: '🇬🇧' }, { value: 'ar', label: 'العربية', flag: '🇩🇿' }];

export default function ClientSettingsPage() {
  const { data: session } = useSession();
  const { theme, toggleTheme } = useTheme();
  const [saving, setSaving] = useState(false);

  function setThemeValue(val) {
    const current = theme;
    if (current !== val) toggleTheme();
    localStorage.setItem('theme', val);
  }

  return (
    <DashboardLayout>
      <div className="max-w-xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Paramètres</h1>
          <p className="text-gray-500 text-sm mt-1">Personnalisez votre expérience</p>
        </div>

        {/* Theme */}
        <div className="card p-6 space-y-4">
          <h2 className="font-semibold text-gray-900 dark:text-white">Apparence</h2>
          <div className="grid grid-cols-3 gap-3">
            {THEMES.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                onClick={() => setThemeValue(value)}
                className={cn(
                  'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all',
                  theme === value
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                )}
              >
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
              <a
                key={value}
                href={`/${value}/dashboard/client/settings`}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <span className="text-2xl">{flag}</span>
                <span className="font-medium text-sm">{label}</span>
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
              <span className="font-medium capitalize">{session?.user?.role}</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
