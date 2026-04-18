'use client';

import { useEffect, useState } from 'react';
import { ARABIC_FONT_OPTIONS, DEFAULT_SETTINGS } from '../lib/settings';

const STORAGE_KEY = 'quran-reader-settings';

export function SettingsSidebar() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw);
      setSettings({ ...DEFAULT_SETTINGS, ...parsed });
    } catch {}
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));

    document.documentElement.style.setProperty(
      '--arabic-font-size',
      `${settings.arabicFontSize}px`
    );
    document.documentElement.style.setProperty(
      '--translation-font-size',
      `${settings.translationFontSize}px`
    );
    document.documentElement.setAttribute('data-arabic-font', settings.arabicFont);
  }, [settings]);

  return (
    <aside className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5 sm:p-6">
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-300">
          Reader Settings
        </p>
        <h2 className="mt-2 text-xl font-semibold text-white">Customize reading</h2>
        <p className="mt-2 text-sm text-slate-400">
          Saved automatically in localStorage.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-200">
            Arabic font
          </label>
          <select
            className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white"
            value={settings.arabicFont}
            onChange={(event) =>
              setSettings((current) => ({
                ...current,
                arabicFont: event.target.value,
              }))
            }
          >
            {ARABIC_FONT_OPTIONS.map((font) => (
              <option key={font.value} value={font.value}>
                {font.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between text-sm text-slate-200">
            <label>Arabic font size</label>
            <span>{settings.arabicFontSize}px</span>
          </div>
          <input
            type="range"
            min="24"
            max="56"
            step="1"
            value={settings.arabicFontSize}
            onChange={(event) =>
              setSettings((current) => ({
                ...current,
                arabicFontSize: Number(event.target.value),
              }))
            }
            className="w-full"
          />
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between text-sm text-slate-200">
            <label>Translation font size</label>
            <span>{settings.translationFontSize}px</span>
          </div>
          <input
            type="range"
            min="14"
            max="28"
            step="1"
            value={settings.translationFontSize}
            onChange={(event) =>
              setSettings((current) => ({
                ...current,
                translationFontSize: Number(event.target.value),
              }))
            }
            className="w-full"
          />
        </div>

        <button
          onClick={() => setSettings(DEFAULT_SETTINGS)}
          className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm font-medium text-white hover:border-emerald-400"
        >
          Reset to default
        </button>
      </div>
    </aside>
  );
}