'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

function highlightText(text, query) {
  if (!query) return text;

  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const parts = text.split(new RegExp(`(${escaped})`, 'gi'));

  return parts.map((part, index) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <mark key={index} className="rounded bg-emerald-400/20 px-1 text-emerald-200">
        {part}
      </mark>
    ) : (
      part
    )
  );
}

export function SearchPanel() {
  const [query, setQuery] = useState('');
  const [debounced, setDebounced] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState('en');

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(query.trim()), 350);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    async function searchAyahs() {
      if (!debounced) {
        setResults([]);
        return;
      }

      try {
        setLoading(true);
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(debounced)}&lang=${lang}`
        );
        const data = await res.json();
        setResults(data.results || []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }

    searchAyahs();
  }, [debounced, lang]);

  const resultCountText = useMemo(() => {
    if (!debounced) return 'Search ayahs by translation text.';
    if (loading) return 'Searching...';
    return `${results.length} result${results.length === 1 ? '' : 's'} found.`;
  }, [debounced, loading, results.length]);

  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5 sm:p-6">
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-300">
          Search
        </p>
        <h2 className="mt-2 text-xl font-semibold text-white">Find ayahs</h2>
        <p className="mt-2 text-sm text-slate-400">{resultCountText}</p>
      </div>

      <div className="mb-3 flex gap-2">
        <button
          onClick={() => setLang('en')}
          className={`rounded-xl px-3 py-2 text-sm ${
            lang === 'en'
              ? 'bg-emerald-500 text-white'
              : 'border border-slate-700 bg-slate-900 text-slate-300'
          }`}
        >
          English
        </button>
        <button
          onClick={() => setLang('bn')}
          className={`rounded-xl px-3 py-2 text-sm ${
            lang === 'bn'
              ? 'bg-emerald-500 text-white'
              : 'border border-slate-700 bg-slate-900 text-slate-300'
          }`}
        >
          Bangla
        </button>
      </div>

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Type translation text..."
        className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none"
      />

      <div className="mt-5 space-y-4">
        {!debounced && (
          <div className="rounded-2xl border border-dashed border-slate-700 p-4 text-sm text-slate-400">
            Example: mercy, guidance
          </div>
        )}

        {debounced && !loading && results.length === 0 && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-400">
            No results found.
          </div>
        )}

        {results.map((result) => {
          const translation =
            lang === 'bn' ? result.translationBn : result.translationEn;

          return (
            <div
              key={`${result.surahId}-${result.verseNumber}`}
              className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4"
            >
              <div className="flex flex-wrap items-center gap-2 text-sm text-emerald-300">
                <span>{result.surahArabicName}</span>
                <span className="text-slate-500">•</span>
                <span>
                  {result.surahName} {result.surahId}:{result.verseNumber}
                </span>
              </div>

              <p className="mt-3 text-right text-2xl leading-loose text-slate-100">
                {result.arabic}
              </p>

              <p className="mt-3 text-base leading-8 text-slate-300">
                {highlightText(translation || '', debounced)}
              </p>

              <Link
                className="mt-4 inline-flex text-sm font-medium text-emerald-300 hover:text-emerald-200"
                href={`/surah/${result.surahId}#verse-${result.verseNumber}`}
              >
                Open surah →
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}