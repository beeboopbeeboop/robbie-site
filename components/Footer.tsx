import type { ArtistContent } from '@/lib/types'

export function Footer({ artist }: { artist: ArtistContent }) {
  const year = new Date().getFullYear()

  return (
    <footer className="relative z-10 px-4 py-8 text-center">
      <p className="text-xs text-[var(--muted)]">
        &copy; {year} {artist.name}. All rights reserved.
      </p>
    </footer>
  )
}
