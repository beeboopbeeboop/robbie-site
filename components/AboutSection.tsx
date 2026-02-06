'use client'

import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Section, itemVariants } from '@/components/Section'
import type { ArtistContent } from '@/lib/types'

export function AboutSection({ artist }: { artist: ArtistContent }) {
  const [videoOpen, setVideoOpen] = useState(false)
  const modalVideoRef = useRef<HTMLVideoElement>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  function openVideo() {
    setVideoOpen(true)
  }

  function closeVideo() {
    setVideoOpen(false)
    if (modalVideoRef.current) {
      modalVideoRef.current.pause()
    }
  }

  return (
    <Section id="about">
      <motion.div variants={itemVariants}>
        <h2 className="title-block">About</h2>
      </motion.div>

      <div className="mt-8 grid gap-10 md:grid-cols-[1fr_0.8fr] md:gap-14">
        {/* Bio */}
        <motion.div className="space-y-4" variants={itemVariants}>
          {artist.bio.map((paragraph, i) => (
            <p key={i} className="text-base leading-relaxed text-[var(--muted)]">
              {paragraph}
            </p>
          ))}
          {artist.pressQuotes[0] && (
            <blockquote className="mt-6 border-l-2 border-[var(--accent)]/40 pl-4">
              <p className="text-lg italic text-[var(--fg)]/90">
                &ldquo;{artist.pressQuotes[0].quote}&rdquo;
              </p>
              <cite className="mt-1 block text-xs not-italic text-[var(--muted)]">
                — {artist.pressQuotes[0].source}
              </cite>
            </blockquote>
          )}
        </motion.div>

        {/* Video */}
        <motion.div variants={itemVariants}>
          <button
            type="button"
            onClick={openVideo}
            className="group relative block w-full overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]"
          >
            <video
              src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/video/placeholder-video.mp4`}
              autoPlay
              muted
              loop
              playsInline
              className="aspect-[3/4] w-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--accent)] text-[#1f130d] shadow-lg transition-all duration-300 group-hover:scale-115 group-hover:shadow-[0_8px_30px_rgba(223,150,100,0.35)]">
                <svg width="22" height="22" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M6 3.5L16 10L6 16.5V3.5Z" />
                </svg>
              </div>
            </div>
          </button>
        </motion.div>
      </div>

      {/* Video Modal — portaled to body to escape Section's stacking context */}
      {mounted && createPortal(
        <AnimatePresence>
          {videoOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-xl"
              onClick={closeVideo}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] as const }}
                className="relative w-full max-w-4xl overflow-hidden rounded-2xl bg-black shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close button */}
                <button
                  type="button"
                  onClick={closeVideo}
                  className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black/80"
                  aria-label="Close video"
                >
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M4 4L14 14M14 4L4 14" />
                  </svg>
                </button>
                <video
                  ref={modalVideoRef}
                  src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/video/placeholder-video.mp4`}
                  autoPlay
                  controls
                  playsInline
                  className="aspect-video w-full"
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </Section>
  )
}
