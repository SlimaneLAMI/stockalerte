'use client';
import { ThemeProvider } from '@/components/ThemeProvider';

export default function PublicProviders({ children }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
