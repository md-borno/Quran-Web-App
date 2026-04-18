'use client';

import { useSettings } from './settings-context';

export function SettingsSidebar() {
  const { settings, setSettings } = useSettings();

  return (
    <aside className="card h-fit p-5 lg:sticky lg:top-6">
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-300">Settings</p>
        <h2 className="mt-2 text-xl font-semibold text-white">Reader preferences</h2>
        <p className="mt-2 text-sm text-slate-400">Saved automatically in localStorage.</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-200">Arabic font</label>
          <select
            className="input"
            value={settings.arabicFont}
            onChange={(event) => setSettings((current) => ({ ...current, arabicFont: event.target.value }))}
          >
            <option value="amiri">Amiri</option>
            <option value="noto">Noto Naskh Arabic</option>
          </select>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between text-sm text-slate-200">
            <label>Arabic font size</label>
            <span>{settings.arabicFontSize}px</span>
          </div>
          <input
            className="range"
            type="range"
            min="24"
            max="52"
            step="1"
            value={settings.arabicFontSize}
            onChange={(event) => setSettings((current) => ({ ...current, arabicFontSize: Number(event.target.value) }))}
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-200">
            Translation language
          </label>
          <select
            className="input"
            value={settings.translationLanguage}
            onChange={(event) =>
              setSettings((current) => ({
                ...current,
                translationLanguage: event.target.value,
              }))
            }
          >
            <option value="en">English</option>
            <option value="bn">Bangla</option>
          </select>
        </div>
        <div>
          <div className="mb-2 flex items-center justify-between text-sm text-slate-200">
            <label>Translation font size</label>
            <span>{settings.translationFontSize}px</span>
          </div>
          <input
            className="range"
            type="range"
            min="14"
            max="28"
            step="1"
            value={settings.translationFontSize}
            onChange={(event) => setSettings((current) => ({ ...current, translationFontSize: Number(event.target.value) }))}
          />
        </div>
      </div>
    </aside>
  );
}
