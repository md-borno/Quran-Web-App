import { NextResponse } from 'next/server';
import { getSearchIndex } from '../../../lib/quran-api';

export const revalidate = 86400;

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q')?.trim().toLowerCase() || '';
    const lang = searchParams.get('lang') === 'bn' ? 'bn' : 'en';

    if (!q) {
      return NextResponse.json({ results: [] });
    }

    const verses = await getSearchIndex();

    const results = verses
      .filter((item) =>
        lang === 'bn'
          ? item.translationBnLower.includes(q)
          : item.translationEnLower.includes(q)
      )
      .slice(0, 50)
      .map(
        ({
          translationEnLower,
          translationBnLower,
          ...rest
        }) => rest
      );

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { results: [], error: 'Failed to search ayahs' },
      { status: 500 }
    );
  }
}