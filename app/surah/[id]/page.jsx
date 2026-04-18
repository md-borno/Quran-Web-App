import { SurahReader } from '../../../components/surah-reader';

export function generateStaticParams() {
  return Array.from({ length: 114 }, (_, index) => ({ id: String(index + 1) }));
}

export default function SurahPage({ params }) {
  return <SurahReader id={params.id} />;
}
