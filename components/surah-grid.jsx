import Link from 'next/link';

export function SurahGrid({ surahs, loading }) {
  return (
    <section className="card p-5 sm:p-6">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-300">Surah List</p>
          <h2 className="mt-2 text-xl font-semibold text-white">All 114 surahs</h2>
        </div>
        <p className="text-sm text-slate-400">Arabic and English names with verse counts.</p>
      </div>

      {loading ? (
        <div className="text-sm text-slate-400">Loading surah list...</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {surahs.map((surah) => (
            <Link
              key={surah.id}
              href={`/surah/${surah.id}`}
              className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 transition hover:border-emerald-400/50 hover:bg-slate-950"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-emerald-300">#{surah.id}</p>
                  <h3 className="mt-2 text-lg font-semibold text-white">
                    {surah.name_simple || surah.name || surah.transliteration || surah.englishName}
                  </h3>
                  <p className="mt-1 text-2xl text-slate-100">
                    {surah.name_arabic || surah.name || surah.arabicName}
                  </p>
                </div>
                <div className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300">
                  {surah.verses_count || surah.versesCount || surah.total_verses || '?'} ayahs
                </div>
              </div>

              <p className="mt-4 text-sm text-slate-400">
                {surah.translated_name || surah.translation || surah.translatedName || surah.englishNameTranslation}
              </p>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
