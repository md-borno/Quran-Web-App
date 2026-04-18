# Quran Web Application

A responsive Quran web app built with **Next.js**, **Tailwind CSS**, and the public **quran-json** dataset.

## Features

- Responsive UI
- Surah list page showing all 114 surahs with Arabic and English names
- Ayat page for each surah with Arabic text and English translation
- Search ayahs by translation text
- Settings sidebar with:
  - Arabic font selection (Amiri / Noto Naskh Arabic)
  - Arabic font size control
  - Translation font size control
  - Persistence via `localStorage`
- Statically generated surah routes (`/surah/1` to `/surah/114`)

## Tech Stack

- Frontend: Next.js 14
- Backend/runtime: Node.js
- Styling: Tailwind CSS
- Data source: quran-json dataset over jsDelivr CDN

## Run locally

```bash
npm install
npm run dev
```

## Production

```bash
npm install
npm run build
npm run start
```

## Suggested deployment

- Vercel
- Netlify

## Submission

Reply in the same email with:
- Public GitHub repository link
- Live demo link
- Screen recording link (under 5 minutes)
