'use client'

import { useEffect, useRef, useCallback } from 'react'
import { useAudioPlayer } from '@/lib/audio-store'

interface AudioVisualizerProps {
  barCount?: number
  barColor?: string
  className?: string
}

export function AudioVisualizer({ barCount = 5, barColor = 'var(--accent)', className = '' }: AudioVisualizerProps) {
  const player = useAudioPlayer()
  const barsRef = useRef<HTMLDivElement>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null)
  const ctxRef = useRef<AudioContext | null>(null)
  const rafRef = useRef<number>(0)
  const connectedElementRef = useRef<HTMLAudioElement | null>(null)

  const connect = useCallback(() => {
    const audioEl = player.getAudioElement()
    if (!audioEl || connectedElementRef.current === audioEl) return

    // Reuse or create AudioContext
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    }

    const ctx = ctxRef.current

    // Create source only once per audio element
    if (!sourceRef.current || connectedElementRef.current !== audioEl) {
      try {
        sourceRef.current = ctx.createMediaElementSource(audioEl)
      } catch {
        // Already connected — reuse existing
        return
      }
    }

    const analyser = ctx.createAnalyser()
    analyser.fftSize = 64
    analyser.smoothingTimeConstant = 0.8

    sourceRef.current.connect(analyser)
    analyser.connect(ctx.destination)
    analyserRef.current = analyser
    connectedElementRef.current = audioEl
  }, [player])

  useEffect(() => {
    if (!player.isPlaying) {
      cancelAnimationFrame(rafRef.current)
      // Reset bars to min height
      if (barsRef.current) {
        const bars = barsRef.current.children
        for (let i = 0; i < bars.length; i++) {
          ;(bars[i] as HTMLElement).style.height = '15%'
        }
      }
      return
    }

    connect()

    if (!analyserRef.current) return

    const analyser = analyserRef.current
    const data = new Uint8Array(analyser.frequencyBinCount)

    function animate() {
      analyser.getByteFrequencyData(data)

      if (barsRef.current) {
        const bars = barsRef.current.children
        const step = Math.floor(data.length / bars.length)

        for (let i = 0; i < bars.length; i++) {
          const value = data[i * step] / 255
          const height = Math.max(15, value * 100)
          ;(bars[i] as HTMLElement).style.height = `${height}%`
        }
      }

      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(rafRef.current)
  }, [player.isPlaying, connect])

  // Resume AudioContext if suspended (browser autoplay policy)
  useEffect(() => {
    if (player.isPlaying && ctxRef.current?.state === 'suspended') {
      ctxRef.current.resume()
    }
  }, [player.isPlaying])

  return (
    <div ref={barsRef} className={`flex items-end gap-[2px] ${className}`}>
      {Array.from({ length: barCount }).map((_, i) => (
        <div
          key={i}
          className="w-[3px] rounded-full transition-[height] duration-75"
          style={{
            height: '15%',
            backgroundColor: barColor,
          }}
        />
      ))}
    </div>
  )
}
