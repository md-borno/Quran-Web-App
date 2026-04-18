export const DEFAULT_SETTINGS = {
  arabicFont: 'amiri',
  arabicFontSize: 36,
  translationFontSize: 18,
};

export const ARABIC_FONT_OPTIONS = [
  { value: 'amiri', label: 'Amiri' },
  { value: 'noto', label: 'Noto Naskh Arabic' },
  { value: 'scheherazade', label: 'Scheherazade New' },
];

export function getArabicFontClass(font) {
  switch (font) {
    case 'noto':
      return 'font-[Noto_Naskh_Arabic]';
    case 'scheherazade':
      return 'font-[Scheherazade_New]';
    case 'amiri':
    default:
      return 'font-[Amiri]';
  }
}