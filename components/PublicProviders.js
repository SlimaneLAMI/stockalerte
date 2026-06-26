'use client';
import { ThemeProvider } from '@/components/ThemeProvider';
import { SettingsProvider } from '@/components/SettingsContext';
import CookieBanner from '@/components/public/CookieBanner';

export default function PublicProviders({ settings, children }) {
  return (
    <ThemeProvider>
      <SettingsProvider settings={settings}>
        {children}
        <CookieBanner />
      </SettingsProvider>
    </ThemeProvider>
  );
}
