import fs from 'fs/promises';
import path from 'path';

const BASE_URL = 'https://api.alquran.cloud/v1';
const BANGLA_EDITION = 'bn.bengali';
const ARABIC_EDITION = 'quran-uthmani';
const ENGLISH_EDITION = 'en.sahih';

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

export async function getSearchIndex() {
  const filePath = path.join(process.cwd(), 'data', 'search-index.json');
  const file = await fs.readFile(filePath, 'utf8');
  return JSON.parse(file);
}