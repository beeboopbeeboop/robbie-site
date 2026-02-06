import type { ArtistContent } from '@/lib/types'

export function Footer({ artist }: { artist: ArtistContent }) {
  const year = new Date().getFullYear()
  const allLinks = Object.entries(artist.socials).filter(([, value]) => value)

  return (
    <footer className="relative z-10 border-t border-[var(--border)] px-4 py-12 text-center">
      <p className="font-display text-3xl uppercase tracking-wide text-[var(--fg)]">
        {artist.wordmarkText}
      </p>

      <div className="mx-auto mt-6 flex flex-wrap items-center justify-center gap-3 text-sm">
        {allLinks.map(([key, value]) => (
          <a
            key={key}
            href={value!}
            target="_blank"
            rel="noreferrer"
            className="text-[var(--muted)] transition hover:text-[var(--accent)]"
          >
            {key}
          </a>
        ))}
      </div>

      <p className="mt-8 text-xs text-[var(--muted)]">
        &copy; {year} {artist.name}. All rights reserved.
      </p>
    </footer>
  )
}
