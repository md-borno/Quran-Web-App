const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://api.alquran.cloud/v1';
const BANGLA_EDITION = 'bn.bengali';
const ARABIC_EDITION = 'quran-uthmani';
const ENGLISH_EDITION = 'en.sahih';

async function fetchJson(url) {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

async function getAllSurahs() {
  const json = await fetchJson(`${BASE_URL}/surah`);
  return json?.data || [];
}

async function getSurahById(id) {
  const [arabicJson, banglaJson, englishJson] = await Promise.all([
    fetchJson(`${BASE_URL}/surah/${id}/${ARABIC_EDITION}`),
    fetchJson(`${BASE_URL}/surah/${id}/${BANGLA_EDITION}`),
    fetchJson(`${BASE_URL}/surah/${id}/${ENGLISH_EDITION}`),
  ]);

  const arabicSurah = arabicJson?.data;
  const banglaSurah = banglaJson?.data;
  const englishSurah = englishJson?.data;

  const arabicAyahs = arabicSurah?.ayahs || [];
  const banglaAyahs = banglaSurah?.ayahs || [];
  const englishAyahs = englishSurah?.ayahs || [];

  return {
    id: Number(arabicSurah?.number || id),
    englishName: arabicSurah?.englishName || '',
    arabicName: arabicSurah?.name || '',
    translatedName: arabicSurah?.englishNameTranslation || '',
    verses: arabicAyahs.map((ayah, index) => ({
      verseNumber: ayah.numberInSurah || index + 1,
      arabic: ayah.text || '',
      translationBn: banglaAyahs[index]?.text || '',
      translationEn: englishAyahs[index]?.text || '',
    })),
  };
}

async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const surahs = await getAllSurahs();
  const allSurahs = [];

  for (const surah of surahs) {
    console.log(`Fetching surah ${surah.number}...`);
    const data = await getSurahById(surah.number);
    allSurahs.push(data);

    // small delay to reduce rate-limit risk
    await delay(300);
  }

  const searchIndex = allSurahs.flatMap((surah) =>
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

  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const outputPath = path.join(dataDir, 'search-index.json');
  fs.writeFileSync(outputPath, JSON.stringify(searchIndex, null, 2), 'utf8');

  console.log(`Done. File saved to: ${outputPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});