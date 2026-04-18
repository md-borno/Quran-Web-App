import { getAllSurahs } from '../lib/quran-api';
import { HomeClient } from '../components/home-client';

export const revalidate = 86400;

export default async function HomePage() {
  const surahs = await getAllSurahs();

  return <HomeClient surahs={surahs} />;
}