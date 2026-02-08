'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import { useAudioPlayer } from '@/lib/audio-store'

interface AudioVisualizerProps {
  barCount?: number
  barColor?: string
  className?: string
}

// Global audio context to ensure single instance across all visualizers
let globalAudioContext: AudioContext | null = null
let globalAnalyser: AnalyserNode | null = null
let globalSource: MediaElementAudioSourceNode | null = null
let connectedAudioEl: HTMLAudioElement | null = null

export function AudioVisualizer({ barCount = 5, barColor = 'var(--accent)', className = '' }: AudioVisualizerProps) {
  const player = useAudioPlayer()
  const barsRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number>(0)
  const [isConnected, setIsConnected] = useState(false)

  const ensureConnected = useCallback(() => {
    const audioEl = player.getAudioElement()
    if (!audioEl) return false

    // Already connected to this audio element
    if (connectedAudioEl === audioEl && globalAnalyser) {
      return true
    }

    try {
      // Create or reuse AudioContext
      if (!globalAudioContext) {
        globalAudioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
      }

      const ctx = globalAudioContext

      // Only create source if we haven't connected this audio element yet
      if (!globalSource || connectedAudioEl !== audioEl) {
        globalSource = ctx.createMediaElementSource(audioEl)
        connectedAudioEl = audioEl
      }

      // Create analyser
      const analyser = ctx.createAnalyser()
      analyser.fftSize = 128
      analyser.smoothingTimeConstant = 0.75

      // Connect: source -> analyser -> destination
      globalSource.connect(analyser)
      analyser.connect(ctx.destination)
      
      globalAnalyser = analyser
      return true
    } catch (err) {
      // If createMediaElementSource fails, element may already be connected elsewhere
      console.warn('Audio visualizer connection error:', err)
      return false
    }
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
      setIsConnected(false)
      return
    }

    // Ensure audio context is running
    if (globalAudioContext?.state === 'suspended') {
      globalAudioContext.resume()
    }

    // Try to connect if not already
    if (!isConnected) {
      const success = ensureConnected()
      if (!success) {
        // If connection failed, use simulated animation
        simulateVisualization()
        return
      }
      setIsConnected(true)
    }

    if (!globalAnalyser) {
      simulateVisualization()
      return
    }

    const analyser = globalAnalyser
    const data = new Uint8Array(analyser.frequencyBinCount)

    function animate() {
      analyser.getByteFrequencyData(data)

      if (barsRef.current) {
        const bars = barsRef.current.children
        // Use logarithmic scaling for more musical representation
        const logScale = Math.log2(data.length) / Math.log2(bars.length)
        
        for (let i = 0; i < bars.length; i++) {
          // Sample frequencies with logarithmic distribution (better for music)
          const freqIndex = Math.floor(Math.pow(2, i * logScale / bars.length) * bars.length / 4)
          const clampedIndex = Math.min(freqIndex, data.length - 1)
          const value = data[clampedIndex] / 255
          const height = Math.max(15, value * 100)
          ;(bars[i] as HTMLElement).style.height = `${height}%`
        }
      }

      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(rafRef.current)
  }, [player.isPlaying, isConnected, ensureConnected])

  // Fallback simulation when Web Audio API isn't available
  function simulateVisualization() {
    let time = 0
    function animate() {
      time += 0.1
      if (barsRef.current) {
        const bars = barsRef.current.children
        for (let i = 0; i < bars.length; i++) {
          // Create varied, organic-looking animation
          const phase = i * 0.5
          const baseHeight = 25 + Math.sin(time + phase) * 20
          const variation = Math.sin(time * 1.3 + phase * 2) * 15
          const height = Math.max(15, Math.min(100, baseHeight + variation))
          ;(bars[i] as HTMLElement).style.height = `${height}%`
        }
      }
      rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)
  }

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
