'use client';

import { useState } from 'react';
import { SearchPanel } from './search-panel';
import { SettingsSidebar } from './settings-sidebar';
import { SurahGrid } from './surah-grid';

export function HomeClient({ surahs }) {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-300">
            Quran Web App
          </p>
          <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">
            Read, search and browse the Quran
          </h1>
          
        </div>

        <button
          onClick={() => setSettingsOpen(true)}
          className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-white hover:border-emerald-400"
        >
          Settings
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <SearchPanel />
          <SurahGrid surahs={surahs} loading={false} />
        </div>

        <div className="hidden lg:block">
          <SettingsSidebar />
        </div>
      </div>

      {settingsOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 lg:hidden">
          <div className="ml-auto h-full w-full max-w-sm overflow-y-auto bg-slate-950 p-4 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Settings</h2>
              <button
                onClick={() => setSettingsOpen(false)}
                className="rounded-lg border border-slate-700 px-3 py-1 text-sm text-white"
              >
                Close
              </button>
            </div>
            <SettingsSidebar />
          </div>
        </div>
      )}
    </main>
  );
}