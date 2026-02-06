'use client'

import { AnimatePresence, m } from 'framer-motion'
import { useAudioPlayer } from '@/lib/audio-store'
import { formatTime } from '@/lib/utils'

export function AudioPlayer() {
  const player = useAudioPlayer()

  if (!player.currentTrack) {
    return null
  }

  const progressMax = Math.max(player.duration, player.currentTrack.duration, 1)
  const progressPct = Math.min(100, Math.max(0, (Math.min(player.currentTime, progressMax) / progressMax) * 100))

  return (
    <AnimatePresence>
      <m.aside
        initial={{ y: 90, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 90, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 240, damping: 28 }}
        className="fixed inset-x-3 bottom-3 z-40 rounded-2xl border border-[var(--border)] bg-[rgba(20,17,15,0.92)] px-4 py-3 shadow-[0_18px_50px_rgba(0,0,0,0.45)]"
        aria-label="Mini player"
      >
        <div className="mb-2 h-1.5 overflow-hidden rounded-full bg-white/10">
          <div className="h-full rounded-full bg-[var(--accent)] transition-[width]" style={{ width: `${progressPct}%` }} />
        </div>

        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-[var(--fg)]">{player.currentTrack.title}</p>
            <p className="text-xs text-[var(--muted)]">
              {formatTime(player.currentTime)} / {formatTime(progressMax)}
            </p>
          </div>

          <button type="button" className="pill-btn !bg-[var(--accent)] !text-[#1f130d]" onClick={player.toggle}>
            {player.isPlaying ? 'Pause' : 'Play'}
          </button>
        </div>

        <label className="mt-3 block">
          <span className="sr-only">Seek track</span>
          <input
            type="range"
            min={0}
            max={progressMax}
            value={Math.min(player.currentTime, progressMax)}
            onChange={(event) => player.seek(Number(event.currentTarget.value))}
            className="w-full accent-[var(--accent)]"
          />
        </label>
      </m.aside>
    </AnimatePresence>
  )
}
