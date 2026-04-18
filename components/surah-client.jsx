'use client';

import Link from 'next/link';
import { useState } from 'react';
import { SettingsSidebar } from './settings-sidebar';
import { VerseList } from './verse-list';

export function SurahClient({ surah, allSurahs }) {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/"
          className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-white hover:border-emerald-400"
        >
          ← Back
        </Link>

        <button
          onClick={() => setSettingsOpen(true)}
          className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-white hover:border-emerald-400"
        >
          Settings
        </button>
      </div>

      <div className="mb-6 rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-300">
          Surah {surah.id}
        </p>
        <h1 className="mt-3 text-3xl font-bold text-white">{surah.englishName}</h1>
        <p className="mt-2 text-4xl text-slate-100">{surah.arabicName}</p>
        <p className="mt-3 text-slate-400">{surah.translatedName}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <VerseList verses={surah.verses} />
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