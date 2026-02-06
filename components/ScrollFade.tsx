'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'

interface ScrollFadeProps {
  children: React.ReactNode
  className?: string
  mode?: 'out' | 'in'
  triggerPoint?: number
  minOpacity?: number
  minScale?: number
  yOffset?: number
}

export function ScrollFade({
  children,
  className,
  mode = 'out',
  triggerPoint = 0.32,
  minOpacity = 0.15,
  minScale = 0.97,
  yOffset,
}: ScrollFadeProps) {
  const ref = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()

  const safeTrigger = Math.max(0.1, Math.min(0.5, triggerPoint))
  const safeMinScale = Math.max(0.8, Math.min(1, minScale))
  const resolvedYOffset = yOffset ?? (mode === 'out' ? -10 : 16)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset:
      mode === 'out'
        ? ['start start', 'end start']
        : ['start 1', 'end 1'],
  })

  const inputRange = mode === 'out' ? [0, 1] : [0, 1 - safeTrigger, 1]

  const opacity = useTransform(scrollYProgress, inputRange, mode === 'out' ? [1, minOpacity] : [minOpacity, 1, 1])
  const scale = useTransform(scrollYProgress, inputRange, mode === 'out' ? [1, safeMinScale] : [safeMinScale, 1, 1])
  const y = useTransform(scrollYProgress, inputRange, mode === 'out' ? [0, resolvedYOffset] : [resolvedYOffset, 0, 0])

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ opacity, scale, y, willChange: 'opacity, transform', transformOrigin: 'center center' }}
    >
      {children}
    </motion.div>
  )
}
