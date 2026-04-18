const BASE_URL = 'https://api.alquran.cloud/v1';
const BANGLA_EDITION = 'bn.bengali';
const ARABIC_EDITION = 'quran-uthmani';

export async function getAllSurahs() {
  const res = await fetch(`${BASE_URL}/surah`, {
    next: { revalidate: 86400 },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch surah list: ${res.status} ${res.statusText}`);
  }

  const json = await res.json();
  const surahs = json?.data || [];

  return surahs.map((surah) => ({
    id: Number(surah.number),
    englishName: surah.englishName || '',
    arabicName: surah.name || '',
    translatedName: surah.englishNameTranslation || '',
    versesCount: surah.numberOfAyahs || 0,
  }));
}

export async function getSurahById(id) {
  const [arabicRes, banglaRes] = await Promise.all([
    fetch(`${BASE_URL}/surah/${id}/${ARABIC_EDITION}`, {
      next: { revalidate: 86400 },
    }),
    fetch(`${BASE_URL}/surah/${id}/${BANGLA_EDITION}`, {
      next: { revalidate: 86400 },
    }),
  ]);

  if (!arabicRes.ok) {
    throw new Error(
      `Failed to fetch Arabic surah ${id}: ${arabicRes.status} ${arabicRes.statusText}`
    );
  }

  if (!banglaRes.ok) {
    throw new Error(
      `Failed to fetch Bengali surah ${id}: ${banglaRes.status} ${banglaRes.statusText}`
    );
  }

  const arabicJson = await arabicRes.json();
  const banglaJson = await banglaRes.json();

  const arabicSurah = arabicJson?.data;
  const banglaSurah = banglaJson?.data;

  const arabicAyahs = arabicSurah?.ayahs || [];
  const banglaAyahs = banglaSurah?.ayahs || [];

  const verses = arabicAyahs.map((ayah, index) => ({
    surahId: Number(id),
    verseNumber: ayah.numberInSurah || index + 1,
    arabic: ayah.text || '',
    translation: banglaAyahs[index]?.text || '',
  }));

  return {
    id: Number(arabicSurah?.number || id),
    englishName: arabicSurah?.englishName || '',
    arabicName: arabicSurah?.name || '',
    translatedName: arabicSurah?.englishNameTranslation || '',
    verses,
  };
}

export async function getSearchIndex() {
  const surahs = await getAllSurahs();

  const all = await Promise.all(surahs.map((surah) => getSurahById(surah.id)));

  return all.flatMap((surah) =>
    surah.verses.map((verse) => ({
      surahId: surah.id,
      verseNumber: verse.verseNumber,
      surahName: surah.englishName,
      surahArabicName: surah.arabicName,
      arabic: verse.arabic,
      translation: verse.translation,
    }))
  );
}