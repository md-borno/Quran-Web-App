'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

export function SearchPanel({ verses, loading }) {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return [];
    return verses.filter((verse) => verse.translation.toLowerCase().includes(normalized)).slice(0, 50);
  }, [query, verses]);

  return (
    <section className="card p-5 sm:p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-300">Search</p>
          <h2 className="mt-2 text-xl font-semibold text-white">Search ayahs by translation</h2>
        </div>
        <p className="text-sm text-slate-400">Instant client-side search over the full translation dataset.</p>
      </div>

      <div className="mt-5">
        <input
          className="input"
          placeholder="Try mercy, guidance, patience..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>

      <div className="mt-5 space-y-3">
        {loading ? (
          <p className="text-sm text-slate-400">Loading searchable verses...</p>
        ) : !query ? (
          <p className="text-sm text-slate-400">Start typing to search within English translation text.</p>
        ) : results.length === 0 ? (
          <p className="text-sm text-slate-400">No ayahs found for “{query}”.</p>
        ) : (
          results.map((result) => (
            <div key={`${result.surahId}-${result.verseNumber}`} className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="flex flex-wrap items-center gap-2 text-sm text-emerald-300">
                <span>{result.surahArabicName}</span>
                <span className="text-slate-500">•</span>
                <span>{result.surahName} {result.surahId}:{result.verseNumber}</span>
              </div>
              <p className="mt-3 text-right text-2xl leading-loose text-slate-100">{result.arabic}</p>
              <p className="mt-3 text-base leading-8 text-slate-300">{result.translation}</p>
              <Link className="mt-4 inline-flex text-sm font-medium text-emerald-300 hover:text-emerald-200" href={`/surah/${result.surahId}#verse-${result.verseNumber}`}>
                Open surah →
              </Link>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
