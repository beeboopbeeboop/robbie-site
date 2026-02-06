import type { Metadata } from 'next'
import { Anton, DM_Sans, Fraunces } from 'next/font/google'
import { getArtistContent } from '@/lib/content'
import { buildMusicGroupJsonLd, buildWebsiteJsonLd } from '@/lib/seo'
import './globals.css'

const sans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const serif = Fraunces({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
})

const display = Anton({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-display',
  display: 'swap',
})

const artist = getArtistContent()

export const metadata: Metadata = {
  metadataBase: new URL(artist.canonicalUrl),
  title: {
    default: `${artist.name} | Folk Pop Artist`,
    template: `%s | ${artist.name}`,
  },
  description: artist.tagline,
  alternates: {
    canonical: artist.canonicalUrl,
  },
  openGraph: {
    type: 'website',
    title: artist.name,
    description: artist.tagline,
    siteName: artist.name,
    url: artist.canonicalUrl,
    images: ['/video/hero-poster.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: artist.name,
    description: artist.tagline,
    images: ['/video/hero-poster.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const websiteJsonLd = buildWebsiteJsonLd(artist)
  const musicGroupJsonLd = buildMusicGroupJsonLd(artist)

  return (
    <html lang="en" className={`${sans.variable} ${serif.variable} ${display.variable}`}>
      <body className="antialiased">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(musicGroupJsonLd) }} />
        {children}
      </body>
    </html>
  )
}
