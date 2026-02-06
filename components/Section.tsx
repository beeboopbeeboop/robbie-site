'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'

const containerVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1] as const,
      staggerChildren: 0.1,
      delayChildren: 0.15,
    },
  },
}

export const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  },
}

interface SectionProps {
  id: string
  className?: string
  cardClassName?: string
  children: React.ReactNode
}

export function Section({ id, className, cardClassName, children }: SectionProps) {
  const reduceMotion = useReducedMotion()

  if (reduceMotion) {
    return (
      <section id={id} className={cn('section-shell scroll-mt-24', className)}>
        <div className={cn('section-card', cardClassName)}>{children}</div>
      </section>
    )
  }

  return (
    <motion.section
      id={id}
      className={cn('section-shell scroll-mt-24', className)}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.08 }}
    >
      <div className={cn('section-card', cardClassName)}>{children}</div>
    </motion.section>
  )
}
