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
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('loading')
    setError('')

    const form = event.currentTarget
    const formData = new FormData(form)

    const payload = {
      name: String(formData.get('name') || ''),
      email: String(formData.get('email') || ''),
      message: String(formData.get('message') || ''),
      website: String(formData.get('website') || ''),
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const body = (await response.json()) as { ok: boolean; error?: string }

      if (!response.ok || !body.ok) {
        setStatus('error')
        setError(body.error || 'Something went wrong.')
        return
      }

      setStatus('success')
      form.reset()
    } catch {
      setStatus('error')
      setError('Unable to send right now. Please use email.')
    }
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
                disabled={status === 'loading'}
              >
                {status === 'loading' ? 'Sending...' : 'Send Message'}
              </button>

              {status === 'success' && (
                <p className="mt-3 text-center text-sm text-green-400">Thanks. We&rsquo;ll reply shortly.</p>
              )}
              {status === 'error' && (
                <p className="mt-3 text-center text-sm text-red-400">{error}</p>
              )}
            </form>
          </motion.div>
        </div>

        {/* Copyright */}
        <motion.p className="mt-8 text-center text-xs text-[var(--muted)]" variants={itemVariants}>
          &copy; {new Date().getFullYear()} {artist.name}. All rights reserved.
        </motion.p>
      </div>
    </Section>
  )
}
