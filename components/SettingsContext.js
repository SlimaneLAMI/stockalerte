'use client';
import { createContext, useContext } from 'react';

const SettingsContext = createContext({});
export const useSettings = () => useContext(SettingsContext);

export function SettingsProvider({ settings, children }) {
  return <SettingsContext.Provider value={settings}>{children}</SettingsContext.Provider>;
}
