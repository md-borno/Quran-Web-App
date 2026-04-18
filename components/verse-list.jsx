export function VerseList({ verses }) {
  return (
    <section className="space-y-4">
      {verses.map((verse) => (
        <article
          id={`verse-${verse.verseNumber}`}
          key={`${verse.surahId}-${verse.verseNumber}`}
          className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5"
        >
          <div className="mb-3 text-sm text-emerald-300">
            Ayah {verse.verseNumber}
          </div>

          <p
            className="mb-4 text-right leading-loose text-slate-100"
            style={{ fontSize: 'var(--arabic-font-size, 36px)' }}
          >
            {verse.arabic}
          </p>

          <p
            className="leading-8 text-slate-300"
            style={{ fontSize: 'var(--translation-font-size, 18px)' }}
          >
            {verse.translation}
          </p>
        </article>
      ))}
    </section>
  );
}