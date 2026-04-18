import './globals.css';
import { Amiri, Noto_Naskh_Arabic } from 'next/font/google';

const amiri = Amiri({
  subsets: ['arabic'],
  weight: ['400', '700'],
  variable: '--font-amiri',
});

const noto = Noto_Naskh_Arabic({
  subsets: ['arabic'],
  weight: ['400', '500', '700'],
  variable: '--font-noto',
});

export const metadata = {
  title: 'Quran Web App',
  description: 'Responsive Quran web app with SSG and settings persistence',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${amiri.variable} ${noto.variable}`}>
      <body className="bg-slate-950 text-white">{children}</body>
    </html>
  );
}