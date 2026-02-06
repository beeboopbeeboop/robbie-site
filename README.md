# Robbie Site

Mobile-first musician website built with Next.js App Router, TypeScript, Tailwind CSS, and Framer Motion.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Production build

```bash
npm run typecheck
npm run lint
npm run build
npm run start
```

## Editable content

All editable site content lives in `/content`:

- `/Users/jon/Documents/robbie-site/content/artist.json`
- `/Users/jon/Documents/robbie-site/content/tracks.json`
- `/Users/jon/Documents/robbie-site/content/shows.json`
- `/Users/jon/Documents/robbie-site/content/media.json`

## Media guidance

- Hero loop video: `/Users/jon/Documents/robbie-site/public/video/hero-loop.mp4`
- Hero fallback poster: `/Users/jon/Documents/robbie-site/public/video/hero-poster.jpg`
- Track covers and gallery photos: `/Users/jon/Documents/robbie-site/public/images`
- Keep hero video short (6-10s), muted, and compressed for mobile.
- Prefer WebP/AVIF for image assets when replacing placeholders.

## SEO included

- Metadata and OpenGraph in layout
- `robots.txt` via `/app/robots.ts`
- `sitemap.xml` via `/app/sitemap.ts`
- Schema.org JSON-LD for `MusicGroup`, `MusicRecording`, and `Event`

## Contact form

Form posts to `/api/contact` with:

- Honeypot (`website`) spam guard
- Basic payload validation
- Server logging placeholder for email integration

Integrate your provider later by replacing the `console.log` inside `/Users/jon/Documents/robbie-site/app/api/contact/route.ts`.
