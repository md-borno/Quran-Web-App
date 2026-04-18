'use client';

import { useEffect, useState } from 'react';
import { CHAPTERS_INDEX_URL, QURAN_SEARCH_URL } from '../lib/constants';
import { SearchPanel } from './search-panel';
import { SettingsSidebar } from './settings-sidebar';
import { SurahGrid } from './surah-grid';

export function HomeContent() {
  const [surahs, setSurahs] = useState([]);
  const [verses, setVerses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        setLoading(true);
        const [surahResponse, quranResponse] = await Promise.all([
          fetch(CHAPTERS_INDEX_URL),
          fetch(QURAN_SEARCH_URL),
        ]);

        if (!surahResponse.ok || !quranResponse.ok) {
          throw new Error('Failed to load Quran data');
        }

        const surahData = await surahResponse.json();
        const quranData = await quranResponse.json();

        const flattenedVerses = quranData.flatMap((surah) =>
          surah.verses.map((verse) => ({
            surahId: surah.id,
            surahName: surah.transliteration,
            surahArabicName: surah.name,
            verseNumber: verse.id,
            translation: verse.translation,
            arabic: verse.text,
          }))
        );

        if (!active) return;
        setSurahs(surahData);
        setVerses(flattenedVerses);
        setError('');
      } catch (err) {
        if (!active) return;
        setError('Unable to load Quran data right now. Please refresh the page.');
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="container-shell py-6 sm:py-10">
      <section className="mb-8 rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 via-slate-900 to-slate-950 p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300">Quran Web Application</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-5xl">Read, search, and customize your Quran experience.</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">Responsive Quran UI with a full surah list, searchable translations, and persistent reading preferences.</p>
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          {error ? (
            <div className="card p-6 text-sm text-rose-300">{error}</div>
          ) : (
            <>
              <SearchPanel verses={verses} loading={loading} />
              <SurahGrid surahs={surahs} loading={loading} />
            </>
          )}
        </div>
        <SettingsSidebar />
      </div>
    </main>
  );
}
