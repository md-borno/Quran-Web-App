'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getChapterUrl } from '../lib/constants';
import { SettingsSidebar } from './settings-sidebar';
import { VerseList } from './verse-list';

export function SurahReader({ id }) {
  const [surah, setSurah] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const response = await fetch(getChapterUrl(id));
        if (!response.ok) throw new Error('Failed to load surah');
        const data = await response.json();
        if (!active) return;
        setSurah(data);
        setError('');
      } catch (err) {
        if (!active) return;
        setError('Unable to load this surah right now. Please refresh the page.');
      }
    }

    load();
    return () => {
      active = false;
    };
  }, [id]);

  if (error) {
    return (
      <main className="container-shell py-6 sm:py-10">
        <Link href="/" className="text-emerald-300 hover:text-emerald-200">← Back to surah list</Link>
        <div className="card mt-6 p-6 text-sm text-rose-300">{error}</div>
      </main>
    );
  }

  if (!surah) {
    return (
      <main className="container-shell py-6 sm:py-10">
        <Link href="/" className="text-emerald-300 hover:text-emerald-200">← Back to surah list</Link>
        <div className="card mt-6 p-6 text-sm text-slate-300">Loading surah...</div>
      </main>
    );
  }

  return (
    <main className="container-shell py-6 sm:py-10">
      <div className="mb-6 flex flex-wrap items-center gap-3 text-sm text-slate-400">
        <Link href="/" className="text-emerald-300 hover:text-emerald-200">← Back to surah list</Link>
        <span className="text-slate-600">/</span>
        <span>{surah.name_simple}</span>
      </div>

      <section className="mb-6 rounded-3xl border border-slate-800 bg-slate-900/70 p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300">Surah {surah.id}</p>
        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white sm:text-5xl">{surah.name_simple}</h1>
            <p className="mt-3 text-4xl text-slate-100">{surah.name_arabic}</p>
            <p className="mt-3 text-slate-400">{surah.translated_name}</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-300">
            <div>{surah.verses_count} ayahs</div>
            <div>{surah.revelation_place}</div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <VerseList verses={surah.verses} />
        <SettingsSidebar />
      </div>
    </main>
  );
}
