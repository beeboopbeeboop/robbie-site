'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import type { Track } from '@/lib/types'
import { Section, itemVariants } from '@/components/Section'
import { useAudioPlayer } from '@/lib/audio-store'

const platformLabels: Record<string, string> = {
  spotify: 'Spotify',
  apple: 'Apple',
  youtube: 'YouTube',
  bandcamp: 'Bandcamp',
}

export function TrackList({ tracks }: { tracks: Track[] }) {
  const player = useAudioPlayer()
  const [activeIndex, setActiveIndex] = useState(0)

  const activeTrack = tracks[activeIndex]
  const isCurrent = activeTrack && player.currentTrack?.id === activeTrack.id
  const isPlaying = isCurrent && player.isPlaying

  function handleSelect(index: number) {
    setActiveIndex(index)
  }

  function handlePlay() {
    if (!activeTrack) return
    if (isCurrent && isPlaying) {
      player.pause()
    } else {
      player.play(activeTrack.id)
    }
  }

  return (
    <Section id="music" className="overflow-visible">
      <motion.div variants={itemVariants}>
        <h2 className="title-block">Selected Tracks</h2>
      </motion.div>

      <motion.div variants={itemVariants} className="mt-10">
        <div className="flex flex-col items-center gap-10 md:flex-row md:gap-16">
          {/* Cascade stack */}
          <div className="relative h-[340px] w-full max-w-[480px] shrink-0 md:h-[400px]">
            {tracks.map((track, i) => {
              const isActive = i === activeIndex
              const offset = i - activeIndex

              // Cascade: items behind fan out diagonally
              const baseX = offset * 40
              const baseY = offset * -12
              const rotation = offset * 5
              const scale = isActive ? 1 : 0.85 - Math.abs(offset) * 0.04
              const zIndex = tracks.length - Math.abs(offset)
              const opacity = isActive ? 1 : 0.6 - Math.abs(offset) * 0.15

              return (
                <motion.button
                  key={track.id}
                  type="button"
                  onClick={() => handleSelect(i)}
                  className="absolute left-1/2 top-1/2 aspect-square w-[240px] origin-bottom-left cursor-pointer overflow-hidden rounded-2xl shadow-2xl md:w-[300px]"
                  style={{ zIndex }}
                  animate={{
                    x: `calc(-50% + ${baseX}px)`,
                    y: `calc(-50% + ${baseY}px)`,
                    rotate: rotation,
                    scale,
                    opacity: Math.max(opacity, 0.25),
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                  whileHover={!isActive ? { scale: scale + 0.04, opacity: Math.min(opacity + 0.2, 1) } : undefined}
                >
                  <Image
                    src={track.coverImage}
                    alt={`${track.title} cover`}
                    fill
                    className="object-cover"
                    sizes="300px"
                  />
                  {/* Active overlay */}
                  {isActive && (
                    <div
                      className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-200 hover:bg-black/30"
                      onClick={(e) => {
                        e.stopPropagation()
                        handlePlay()
                      }}
                    >
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
                  )}
                  {/* Playing indicator */}
                  {isActive && isPlaying && (
                    <div className="absolute bottom-3 left-3 flex items-end gap-0.5">
                      <span className="playing-bar h-3 w-1 rounded-full bg-[var(--accent)]" />
                      <span className="playing-bar h-4 w-1 rounded-full bg-[var(--accent)]" style={{ animationDelay: '0.15s' }} />
                      <span className="playing-bar h-2.5 w-1 rounded-full bg-[var(--accent)]" style={{ animationDelay: '0.3s' }} />
                    </div>
                  )}
                </motion.button>
              )
            })}
          </div>

          {/* Track info panel */}
          <div className="w-full text-center md:text-left">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTrack.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
              >
                <h3 className="font-display text-3xl uppercase md:text-5xl">
                  {activeTrack.title}
                </h3>

                <div className="mt-6 flex flex-wrap justify-center gap-3 md:justify-start">
                  <button
                    type="button"
                    onClick={handlePlay}
                    className="pill-btn !border-[var(--accent)] !bg-[var(--accent)] !text-[#1f130d]"
                  >
                    {isPlaying ? 'Pause' : 'Play'}
                  </button>
                </div>

                <div className="mt-4 flex flex-wrap justify-center gap-2 md:justify-start">
                  {Object.entries(activeTrack.links).map(([key, value]) =>
                    value ? (
                      <a
                        key={key}
                        href={value}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full border border-[var(--border)] px-3 py-1 text-xs text-[var(--muted)] transition hover:border-[var(--accent)]/50 hover:text-[var(--fg)]"
                      >
                        {platformLabels[key]}
                      </a>
                    ) : null,
                  )}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Track selector pills */}
            <div className="mt-8 flex justify-center gap-2 md:justify-start">
              {tracks.map((track, i) => (
                <button
                  key={track.id}
                  type="button"
                  onClick={() => handleSelect(i)}
                  className={`rounded-full px-4 py-2 text-sm transition ${
                    i === activeIndex
                      ? 'bg-white/12 text-[var(--fg)]'
                      : 'border border-[var(--border)] text-[var(--muted)] hover:text-[var(--fg)]'
                  }`}
                >
                  {track.title}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </Section>
  )
}
