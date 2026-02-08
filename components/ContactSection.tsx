'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Section, itemVariants } from '@/components/Section'
import type { ArtistContent } from '@/lib/types'

const socialLabels: Record<string, string> = {
  instagram: 'Instagram',
  tiktok: 'TikTok',
  youtube: 'YouTube',
  spotify: 'Spotify',
  appleMusic: 'Apple Music',
  bandcamp: 'Bandcamp',
}

export function ContactSection({ artist }: { artist: ArtistContent }) {
  const [status, setStatus] = useState<'idle' | 'success'>('idle')

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)

    const name = String(formData.get('name') || '')
    const email = String(formData.get('email') || '')
    const message = String(formData.get('message') || '')

    const subject = encodeURIComponent(`Inquiry from ${name}`)
    const body = encodeURIComponent(`From: ${name} (${email})\n\n${message}`)
    window.location.href = `mailto:${artist.bookingEmail}?subject=${subject}&body=${body}`

    setStatus('success')
    form.reset()
  }

  return (
    <Section id="contact">
      <div className="mx-auto max-w-4xl">
        <div className="grid gap-12 md:grid-cols-[1fr_1.2fr] md:gap-16">
          {/* Left — info */}
          <motion.div variants={itemVariants}>
            <h2 className="font-display text-4xl uppercase md:text-5xl">Get in Touch</h2>
            <p className="mt-4 text-sm leading-relaxed text-[var(--muted)]">
              For bookings, press inquiries, or just to say hello.
            </p>

            <a
              href={`mailto:${artist.bookingEmail}`}
              className="mt-6 block text-sm text-[var(--accent)] transition hover:underline"
            >
              {artist.bookingEmail}
            </a>

            <div className="mt-6 flex flex-wrap gap-2">
              {Object.entries(artist.socials).map(([key, value]) =>
                value ? (
                  <a
                    key={key}
                    href={value}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-[var(--border)] px-3 py-1.5 text-xs text-[var(--muted)] transition hover:border-[var(--accent)]/50 hover:text-[var(--fg)]"
                  >
                    {socialLabels[key] || key}
                  </a>
                ) : null,
              )}
            </div>
          </motion.div>

          {/* Right — form */}
          <motion.div variants={itemVariants}>
            <form onSubmit={onSubmit} className="rounded-2xl border border-[var(--border)] bg-[var(--card)]/60 p-7 md:p-8">
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block">
                  <span className="text-[11px] uppercase tracking-[0.12em] text-[var(--muted)]">Name</span>
                  <input
                    required
                    name="name"
                    className="mt-1.5 w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2.5 text-sm text-[var(--fg)] outline-none transition focus:border-[var(--accent)]"
                    autoComplete="name"
                  />
                </label>

                <label className="block">
                  <span className="text-[11px] uppercase tracking-[0.12em] text-[var(--muted)]">Email</span>
                  <input
                    required
                    type="email"
                    name="email"
                    className="mt-1.5 w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2.5 text-sm text-[var(--fg)] outline-none transition focus:border-[var(--accent)]"
                    autoComplete="email"
                  />
                </label>
              </div>

              <label className="mt-5 hidden" aria-hidden="true">
                Website
                <input tabIndex={-1} autoComplete="off" name="website" />
              </label>

              <label className="mt-5 block">
                <span className="text-[11px] uppercase tracking-[0.12em] text-[var(--muted)]">Message</span>
                <textarea
                  required
                  name="message"
                  rows={4}
                  className="mt-1.5 w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2.5 text-sm text-[var(--fg)] outline-none transition focus:border-[var(--accent)]"
                />
              </label>

              <button
                type="submit"
                className="pill-btn mt-5 w-full !bg-[var(--accent)] !text-[#1f130d]"
              >
                Send Message
              </button>

              {status === 'success' && (
                <p className="mt-3 text-center text-sm text-green-400">Opening your email client&hellip;</p>
              )}
            </form>
          </motion.div>
        </div>

      </div>
    </Section>
  )
}
