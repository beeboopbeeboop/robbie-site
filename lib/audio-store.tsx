'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import type { Track } from '@/lib/types'

interface AudioContextValue {
  tracks: Track[]
  currentTrack: Track | null
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
  play: (trackId: string) => Promise<void>
  pause: () => void
  toggle: () => void
  seek: (time: number) => void
  setVolume: (volume: number) => void
  getAudioElement: () => HTMLAudioElement | null
}

const AudioContext = createContext<AudioContextValue | null>(null)

export function AudioPlayerProvider({ tracks, children }: { tracks: Track[]; children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [currentTrackId, setCurrentTrackId] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolumeState] = useState(1)

  const currentTrack = useMemo(
    () => tracks.find((track) => track.id === currentTrackId) ?? null,
    [tracks, currentTrackId],
  )

  useEffect(() => {
    const audio = new Audio()
    audio.preload = 'none'
    audioRef.current = audio

    const onTimeUpdate = () => setCurrentTime(audio.currentTime)
    const onLoadedMetadata = () => setDuration(Number.isFinite(audio.duration) ? audio.duration : 0)
    const onEnded = () => setIsPlaying(false)

    audio.addEventListener('timeupdate', onTimeUpdate)
    audio.addEventListener('loadedmetadata', onLoadedMetadata)
    audio.addEventListener('ended', onEnded)

    return () => {
      audio.pause()
      audio.src = ''
      audio.removeEventListener('timeupdate', onTimeUpdate)
      audio.removeEventListener('loadedmetadata', onLoadedMetadata)
      audio.removeEventListener('ended', onEnded)
    }
  }, [])

  const play = useCallback(
    async (trackId: string) => {
      const audio = audioRef.current
      const track = tracks.find((item) => item.id === trackId)

      if (!audio || !track) return

      if (audio.src !== new URL(track.audioUrl, window.location.origin).toString()) {
        audio.src = track.audioUrl
        audio.preload = 'metadata'
        audio.load()
        setCurrentTime(0)
      }

      setCurrentTrackId(track.id)
      await audio.play().catch(() => undefined)
      setIsPlaying(!audio.paused)
    },
    [tracks],
  )

  const pause = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.pause()
    setIsPlaying(false)
  }, [])

  const toggle = useCallback(() => {
    if (!currentTrackId) return
    if (isPlaying) {
      pause()
      return
    }

    void play(currentTrackId)
  }, [currentTrackId, isPlaying, pause, play])

  const seek = useCallback((time: number) => {
    const audio = audioRef.current
    if (!audio || !Number.isFinite(time)) return

    const clamped = Math.max(0, Math.min(time, duration || Number.MAX_SAFE_INTEGER))
    audio.currentTime = clamped
    setCurrentTime(clamped)
  }, [duration])

  const setVolume = useCallback((nextVolume: number) => {
    const audio = audioRef.current
    const clamped = Math.max(0, Math.min(nextVolume, 1))

    if (audio) {
      audio.volume = clamped
    }

    setVolumeState(clamped)
  }, [])

  const getAudioElement = useCallback(() => audioRef.current, [])

  const value = useMemo<AudioContextValue>(
    () => ({
      tracks,
      currentTrack,
      isPlaying,
      currentTime,
      duration,
      volume,
      play,
      pause,
      toggle,
      seek,
      setVolume,
      getAudioElement,
    }),
    [tracks, currentTrack, isPlaying, currentTime, duration, volume, play, pause, toggle, seek, setVolume, getAudioElement],
  )

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>
}

export function useAudioPlayer(): AudioContextValue {
  const context = useContext(AudioContext)
  if (!context) {
    throw new Error('useAudioPlayer must be used inside AudioPlayerProvider')
  }

  return context
}
