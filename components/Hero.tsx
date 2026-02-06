'use client'

import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'
import type { ArtistContent, Track } from '@/lib/types'
import { useAudioPlayer } from '@/lib/audio-store'
import { AudioVisualizer } from '@/components/AudioVisualizer'

const socialIcons: Record<string, { label: string; icon: React.ReactNode }> = {
  instagram: {
    label: 'Instagram',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  tiktok: {
    label: 'TikTok',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.72a8.28 8.28 0 004.76 1.5v-3.4a4.85 4.85 0 01-1-.13z" />
      </svg>
    ),
  },
  youtube: {
    label: 'YouTube',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.5 6.19a3.02 3.02 0 00-2.12-2.14C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.38.55A3.02 3.02 0 00.5 6.19 31.6 31.6 0 000 12a31.6 31.6 0 00.5 5.81 3.02 3.02 0 002.12 2.14c1.88.55 9.38.55 9.38.55s7.5 0 9.38-.55a3.02 3.02 0 002.12-2.14A31.6 31.6 0 0024 12a31.6 31.6 0 00-.5-5.81zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" />
      </svg>
    ),
  },
  spotify: {
    label: 'Spotify',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.52 17.34c-.24.36-.66.48-1.02.24-2.82-1.74-6.36-2.1-10.56-1.14-.42.12-.78-.18-.9-.54-.12-.42.18-.78.54-.9 4.56-1.02 8.52-.6 11.7 1.32.42.18.48.66.24 1.02zm1.44-3.3c-.3.42-.84.6-1.26.3-3.24-1.98-8.16-2.58-11.94-1.38-.48.12-.96-.12-1.08-.6-.12-.48.12-.96.6-1.08 4.38-1.32 9.78-.66 13.5 1.62.36.18.54.78.18 1.14zm.12-3.36C15.24 8.4 8.88 8.16 5.16 9.3c-.54.18-1.14-.12-1.32-.66-.18-.54.12-1.14.66-1.32 4.26-1.26 11.28-1.02 15.72 1.56.54.3.72 1.02.42 1.56-.3.42-.96.6-1.56.3z" />
      </svg>
    ),
  },
}

export function Hero({ artist, featuredTrack }: { artist: ArtistContent; featuredTrack?: Track }) {
  const reduceMotion = useReducedMotion()
  const player = useAudioPlayer()

  const isCurrent = featuredTrack && player.currentTrack?.id === featuredTrack.id
  const isPlaying = isCurrent && player.isPlaying

  const fade = (delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 30 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] as const },
        }

  function handlePlay() {
    if (!featuredTrack) return
    if (isCurrent && isPlaying) {
      player.pause()
    } else {
      player.play(featuredTrack.id)
    }
  }

  return (
    <section id="home" className="relative overflow-hidden pb-8 pt-24 md:pb-14 md:pt-28">
      {/* Ambient glows */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute left-[50%] top-[10%] h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-[var(--accent)] opacity-[0.05] blur-[150px]" />
        <div className="absolute bottom-[20%] right-[10%] h-[300px] w-[400px] rounded-full bg-[var(--accent-2)] opacity-[0.04] blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto px-6 md:px-8" style={{ maxWidth: 'var(--content-max)' }}>
        {/* Artist name — single line */}
        <motion.div className="text-center" {...fade(0.1)}>
          <h1 className="title-hero mx-auto">
            <span className="text-[var(--fg)]">{artist.wordmarkText.split(' ')[0]}</span>{' '}
            <span className="text-[var(--accent)]">{artist.wordmarkText.split(' ').slice(1).join(' ')}</span>
          </h1>
        </motion.div>

        {/* Album feature — two column */}
        {featuredTrack && (
          <motion.div className="mt-10 flex flex-col items-center gap-8 md:mt-14 md:flex-row md:justify-center md:gap-16" {...fade(0.3)}>
            {/* Album + Vinyl container */}
            <div className="group relative shrink-0">
              <div className="relative flex items-center justify-center">
                {/* Vinyl record */}
                <div
                  className={`vinyl-record absolute h-[240px] w-[240px] rounded-full md:h-[320px] md:w-[320px] ${isPlaying ? 'vinyl-out vinyl-spinning' : 'vinyl-in'}`}
                >
                  <div className="absolute inset-0 rounded-full bg-[#1c1917] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]" />
                  <div className="absolute inset-[12%] rounded-full border border-[rgba(255,255,255,0.06)]" />
                  <div className="absolute inset-[20%] rounded-full border border-[rgba(255,255,255,0.04)]" />
                  <div className="absolute inset-[28%] rounded-full border border-[rgba(255,255,255,0.05)]" />
                  <div className="absolute inset-[36%] rounded-full border border-[rgba(255,255,255,0.03)]" />
                  {/* Label */}
                  <div className="absolute inset-[38%] rounded-full bg-gradient-to-br from-[var(--accent)] to-[#8b5e3c] opacity-60" />
                  <div className="absolute inset-[42%] rounded-full bg-gradient-to-br from-[var(--accent)]/40 to-[#6b4226]/30" />
                  <div className="absolute inset-[47%] rounded-full bg-[#1c1917] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)]" />
                </div>

                {/* Album cover */}
                <button
                  type="button"
                  onClick={handlePlay}
                  className="relative z-10 h-[240px] w-[240px] cursor-pointer overflow-hidden rounded-2xl border border-[var(--border)] shadow-2xl transition-transform duration-300 hover:scale-[1.03] md:h-[320px] md:w-[320px]"
                >
                  <Image
                    src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/images/album-cover.png`}
                    alt={`${featuredTrack.title} album art`}
                    fill
                    className="object-cover"
                    sizes="320px"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-200 hover:bg-black/30">
                    <div className={`flex h-14 w-14 items-center justify-center rounded-full bg-[var(--accent)] text-[#1f130d] shadow-lg transition-all duration-200 ${isPlaying ? 'scale-100 opacity-100' : 'scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100'}`}>
                      {isPlaying ? (
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                          <rect x="5" y="3" width="4" height="14" rx="1" />
                          <rect x="11" y="3" width="4" height="14" rx="1" />
                        </svg>
                      ) : (
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M6 3.5L16 10L6 16.5V3.5Z" />
                        </svg>
                      )}
                    </div>
                  </div>
                  {isPlaying && (
                    <div className="absolute bottom-3 left-3 h-5">
                      <AudioVisualizer barCount={4} barColor="#f4eee6" className="h-full" />
                    </div>
                  )}
                </button>
              </div>
            </div>

            {/* Album info */}
            <div className="text-center md:text-left">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--accent)]">New Release</p>
              <h2 className="mt-2 font-display text-3xl uppercase md:text-5xl">{featuredTrack.title}</h2>
              <div className="mt-6 flex flex-wrap justify-center gap-3 md:justify-start">
                <button
                  type="button"
                  onClick={handlePlay}
                  className="pill-btn !border-[var(--accent)] !bg-[var(--accent)] !text-[#1f130d]"
                >
                  Stream Now
                </button>
                {featuredTrack.links.bandcamp && (
                  <a
                    href={featuredTrack.links.bandcamp}
                    target="_blank"
                    rel="noreferrer"
                    className="pill-btn btn-ghost !text-[var(--fg)]"
                  >
                    Buy Digital
                  </a>
                )}
              </div>
              <div className="mt-4 flex flex-wrap justify-center gap-3 md:justify-start">
                {Object.entries(featuredTrack.links).map(([key, url]) =>
                  url ? (
                    <a
                      key={key}
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full border border-[var(--border)] px-3 py-1 text-xs text-[var(--muted)] transition hover:border-[var(--accent)]/50 hover:text-[var(--fg)]"
                    >
                      {key === 'spotify' ? 'Spotify' : key === 'apple' ? 'Apple Music' : key === 'youtube' ? 'YouTube' : key === 'bandcamp' ? 'Bandcamp' : key}
                    </a>
                  ) : null,
                )}
              </div>

              {/* Social media icons */}
              <div className="mt-6 flex justify-center gap-3 md:justify-start">
                {Object.entries(artist.socials).map(([key, url]) => {
                  const social = socialIcons[key]
                  if (!url || !social) return null
                  return (
                    <a
                      key={key}
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={social.label}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] text-[var(--muted)] transition-all duration-200 hover:scale-110 hover:border-[var(--accent)]/60 hover:text-[var(--accent)]"
                    >
                      {social.icon}
                    </a>
                  )
                })}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  )
}
