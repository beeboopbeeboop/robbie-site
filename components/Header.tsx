
'use client'

import { useEffect, useState } from 'react'
import { NavDrawer, type NavLinkItem } from '@/components/NavDrawer'

const links: NavLinkItem[] = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'music', label: 'Music' },
  { id: 'live', label: 'Shows' },
  { id: 'contact', label: 'Contact' },
]

export function Header({ artistName }: { artistName: string }) {
  const [open, setOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')

  // Section observer
  useEffect(() => {
    const sections = links.map((link) => document.getElementById(link.id)).filter((el): el is HTMLElement => Boolean(el))
    if (sections.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveSection(entry.target.id)
        }
      },
      { rootMargin: '-42% 0px -42% 0px', threshold: [0.2, 0.5, 0.8] },
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  return (
    <header className="fixed inset-x-0 top-3 z-50 px-3 transition-all duration-300 md:px-5">
      <div className="header-glass mx-auto h-14 max-w-7xl rounded-2xl">
        <div className="header-fade flex h-full items-center justify-between px-4 md:px-6">
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="header-btn rounded-full px-3 py-2 font-display text-lg uppercase tracking-wide text-[var(--fg)]"
        >
          {artistName}
        </button>

        <button
          type="button"
          className="header-btn flex flex-col items-center justify-center gap-1.5 rounded-full p-2 md:hidden"
          onClick={() => setOpen(true)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label="Open menu"
        >
          <span className="block h-px w-5 bg-[var(--fg)]" />
          <span className="block h-px w-5 bg-[var(--fg)]" />
          <span className="block h-px w-3.5 bg-[var(--fg)]" />
        </button>

        <nav aria-label="Section navigation" className="hidden items-center gap-1 md:flex">
          {links.filter((l) => l.id !== 'home').map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              className={`header-btn rounded-full px-3 py-2 text-sm transition ${
                activeSection === link.id
                  ? 'bg-white/12 text-[var(--fg)]'
                  : 'text-[var(--muted)] hover:text-[var(--fg)]'
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>
        </div>
      </div>

      <NavDrawer open={open} onClose={() => setOpen(false)} links={links} activeSection={activeSection} />
    </header>
  )
}
