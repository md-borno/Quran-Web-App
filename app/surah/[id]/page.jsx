import { notFound } from 'next/navigation';
import { getAllSurahs, getSurahById } from '../../../lib/quran-api';
import { SurahClient } from '../../../components/surah-client';

export const revalidate = 86400;
export const dynamic = 'force-dynamic';

export default async function SurahPage({ params }) {
  const id = Number(params.id);

  if (!id || id < 1 || id > 114) {
    notFound();
  }

  const surah = await getSurahById(id);
  const allSurahs = await getAllSurahs();

  return <SurahClient surah={surah} allSurahs={allSurahs} />;
}