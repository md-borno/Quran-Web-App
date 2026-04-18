import { NextResponse } from 'next/server';
import { getSearchIndex } from '../../../lib/quran-api';

export const revalidate = 86400;

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.trim().toLowerCase() || '';

  if (!q) {
    return NextResponse.json({ results: [] });
  }

  const verses = await getSearchIndex();

  const results = verses
    .filter((item) => item.translation.toLowerCase().includes(q))
    .slice(0, 50);

  return NextResponse.json({ results });
}