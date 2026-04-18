'use client';

import { useSettings } from './settings-context';

export function VerseList({ verses }) {
  const { settings } = useSettings();
  const arabicClassName = settings.arabicFont === 'noto' ? 'font-arabic-noto' : 'font-arabic-amiri';

  return (
    <div className="space-y-4">
      {verses.map((verse) => (
        <article id={`verse-${verse.id}`} key={verse.id} className="card p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3 text-sm text-slate-400">
            <span>Ayah {verse.id}</span>
            <span>{verse.verse_key}</span>
          </div>
          <p
            className={`mt-5 text-right leading-loose text-slate-50 ${arabicClassName}`}
            style={{ fontSize: `${settings.arabicFontSize}px` }}
          >
            {verse.text}
          </p>
          <p className="mt-5 leading-8 text-slate-300" style={{ fontSize: `${settings.translationFontSize}px` }}>
            {verse.translation}
          </p>
        </article>
      ))}
    </div>
  );
}
