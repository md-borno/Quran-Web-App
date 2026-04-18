'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const defaultSettings = {
  arabicFont: 'amiri',
  arabicFontSize: 34,
  translationFontSize: 18,
  translationLanguage: 'en',
};

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(defaultSettings);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const raw = window.localStorage.getItem('quran-settings');
    if (raw) {
      try {
        setSettings({ ...defaultSettings, ...JSON.parse(raw) });
      } catch (error) {
        console.error('Failed to parse settings', error);
      }
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    window.localStorage.setItem('quran-settings', JSON.stringify(settings));
  }, [mounted, settings]);

  const value = useMemo(() => ({ settings, setSettings }), [settings]);

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within SettingsProvider');
  return context;
}
