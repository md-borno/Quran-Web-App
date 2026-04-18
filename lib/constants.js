export const CHAPTERS_INDEX_URL =
  'https://cdn.jsdelivr.net/npm/quran-json@3.1.2/dist/chapters/en/index.json';

export const QURAN_SEARCH_URL_EN =
  'https://cdn.jsdelivr.net/npm/quran-json@3.1.2/dist/quran_en.json';

export const QURAN_SEARCH_URL_BN =
  'https://cdn.jsdelivr.net/npm/quran-cloud@1.0.0/dist/quran_bn.json';

export const getChapterUrl = (id) =>
  `https://cdn.jsdelivr.net/npm/quran-json@3.1.2/dist/chapters/en/${id}.json`;