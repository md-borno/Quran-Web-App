const BASE_URL = 'https://api.alquran.cloud/v1';
const BANGLA_EDITION = 'bn.bengali';
const ARABIC_EDITION = 'quran-uthmani';
const ENGLISH_EDITION = 'en.sahih';

// cache for search index
let searchIndexCache = null;
let searchIndexPromise = null;

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
  const [arabicRes, banglaRes, englishRes] = await Promise.all([
    fetch(`${BASE_URL}/surah/${id}/${ARABIC_EDITION}`, {
      next: { revalidate: 86400 },
    }),
    fetch(`${BASE_URL}/surah/${id}/${BANGLA_EDITION}`, {
      next: { revalidate: 86400 },
    }),
    fetch(`${BASE_URL}/surah/${id}/${ENGLISH_EDITION}`, {
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

  if (!englishRes.ok) {
    throw new Error(
      `Failed to fetch English surah ${id}: ${englishRes.status} ${englishRes.statusText}`
    );
  }

  const arabicJson = await arabicRes.json();
  const banglaJson = await banglaRes.json();
  const englishJson = await englishRes.json();

  const arabicSurah = arabicJson?.data;
  const banglaSurah = banglaJson?.data;
  const englishSurah = englishJson?.data;

  const arabicAyahs = arabicSurah?.ayahs || [];
  const banglaAyahs = banglaSurah?.ayahs || [];
  const englishAyahs = englishSurah?.ayahs || [];

  const verses = arabicAyahs.map((ayah, index) => ({
    surahId: Number(id),
    verseNumber: ayah.numberInSurah || index + 1,
    arabic: ayah.text || '',
    translationBn: banglaAyahs[index]?.text || '',
    translationEn: englishAyahs[index]?.text || '',
  }));

  return {
    id: Number(arabicSurah?.number || id),
    englishName: arabicSurah?.englishName || '',
    arabicName: arabicSurah?.name || '',
    translatedName: arabicSurah?.englishNameTranslation || '',
    verses,
  };
}

async function buildSearchIndex() {
  const surahs = await getAllSurahs();
  const allSurahs = await Promise.all(surahs.map((surah) => getSurahById(surah.id)));

  return allSurahs.flatMap((surah) =>
    surah.verses.map((verse) => ({
      surahId: surah.id,
      verseNumber: verse.verseNumber,
      surahName: surah.englishName,
      surahArabicName: surah.arabicName,
      arabic: verse.arabic,
      translationEn: verse.translationEn || '',
      translationBn: verse.translationBn || '',
      translationEnLower: (verse.translationEn || '').toLowerCase(),
      translationBnLower: (verse.translationBn || '').toLowerCase(),
    }))
  );
}

export async function getSearchIndex() {
  if (searchIndexCache) {
    return searchIndexCache;
  }

  if (!searchIndexPromise) {
    searchIndexPromise = buildSearchIndex()
      .then((data) => {
        searchIndexCache = data;
        return data;
      })
      .catch((error) => {
        searchIndexPromise = null;
        throw error;
      });
  }

  return searchIndexPromise;
}