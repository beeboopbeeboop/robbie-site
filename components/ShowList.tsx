'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Section, itemVariants } from '@/components/Section'
import type { Show } from '@/lib/types'

function formatShowDate(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(date)
}

export function ShowList({ shows }: { shows: Show[] }) {
  const upcoming = shows
    .filter((show) => show.status === 'upcoming')
    .sort((a, b) => new Date(a.dateISO).getTime() - new Date(b.dateISO).getTime())

  const [newsletterOpen, setNewsletterOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  function handleSubscribe(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!email) return
    setSubscribed(true)
    setEmail('')
  }

  return (
    <Section id="live">
      <motion.div variants={itemVariants}>
        <h2 className="title-block">Shows</h2>
      </motion.div>

      {upcoming.length > 0 ? (
        <>
          <div className="mt-8 grid gap-3">
            {upcoming.map((show) => (
              <motion.div
                key={show.id}
                variants={itemVariants}
                className="flex items-center justify-between gap-4 rounded-2xl border border-[var(--border)] bg-[var(--card)]/60 px-5 py-5 transition-colors hover:border-[var(--border)]/80 hover:bg-[var(--card)] md:px-7"
              >
                <div className="flex flex-wrap items-baseline gap-x-5 gap-y-1">
                  <span className="font-display text-2xl uppercase">{formatShowDate(show.dateISO)}</span>
                  <span className="text-sm text-[var(--muted)]">
                    {show.venue}, {show.city}
                  </span>
                </div>
                {show.ticketUrl ? (
                  <a
                    href={show.ticketUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="shrink-0 rounded-full border border-[var(--border)] px-4 py-1.5 text-sm text-[var(--muted)] transition hover:border-[var(--accent)]/50 hover:text-[var(--fg)]"
                  >
                    Tickets
                  </a>
                ) : null}
              </motion.div>
            ))}
          </div>
          <motion.p variants={itemVariants} className="mt-6 text-center text-sm">
            <span className="text-[var(--muted)]">More shows coming soon...</span>
            {' '}
            <button
              type="button"
              onClick={() => setNewsletterOpen(true)}
              className="text-[var(--accent)] transition hover:text-[var(--accent)]/70"
            >
              Sign up for updates
            </button>
          </motion.p>
        </>
      ) : (
        <motion.div variants={itemVariants} className="mt-6 text-center">
          <p className="text-sm">
            <span className="text-[var(--muted)]">More shows coming soon...</span>
            {' '}
            <button
              type="button"
              onClick={() => setNewsletterOpen(true)}
              className="text-[var(--accent)] transition hover:text-[var(--accent)]/70"
            >
              Sign up for updates
            </button>
          </p>
        </motion.div>
      )}

      {/* Newsletter Modal — portaled to body to escape Section's stacking context */}
      {mounted && createPortal(
        <AnimatePresence>
          {newsletterOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-xl"
              onClick={() => { setNewsletterOpen(false); setSubscribed(false) }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] as const }}
                className="relative w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close button */}
                <button
                  type="button"
                  onClick={() => { setNewsletterOpen(false); setSubscribed(false) }}
                  className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-[var(--muted)] transition hover:text-[var(--fg)]"
                  aria-label="Close"
                >
                  <svg width="16" height="16" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M4 4L14 14M14 4L4 14" />
                  </svg>
                </button>

                {subscribed ? (
                  <div className="text-center">
                    <h3 className="font-display text-2xl uppercase">Thank You</h3>
                    <p className="mt-3 text-sm text-[var(--muted)]">
                      You&rsquo;ll be the first to know about upcoming shows and releases.
                    </p>
                    <button
                      type="button"
                      onClick={() => { setNewsletterOpen(false); setSubscribed(false) }}
                      className="pill-btn mt-6 !bg-[var(--accent)] !text-[#1f130d]"
                    >
                      Done
                    </button>
                  </div>
                ) : (
                  <>
                    <h3 className="font-display text-2xl uppercase">Stay Updated</h3>
                    <p className="mt-2 text-sm text-[var(--muted)]">
                      Get notified about upcoming shows and new releases.
                    </p>
                    <form onSubmit={handleSubscribe} className="mt-6">
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Your email"
                        className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-sm text-[var(--fg)] outline-none transition focus:border-[var(--accent)]"
                      />
                      <button
                        type="submit"
                        className="pill-btn mt-4 w-full !bg-[var(--accent)] !text-[#1f130d]"
                      >
                        Subscribe
                      </button>
                    </form>
                  </>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </Section>
  )
}
