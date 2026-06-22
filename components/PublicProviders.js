'use client';
import { ThemeProvider } from '@/components/ThemeProvider';
import { SettingsProvider } from '@/components/SettingsContext';

export default function PublicProviders({ settings, children }) {
  return (
    <ThemeProvider>
      <SettingsProvider settings={settings}>
        {children}
      </SettingsProvider>
    </ThemeProvider>
  );
}
