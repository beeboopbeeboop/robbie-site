import type { MetadataRoute } from 'next'
import { getArtistContent } from '@/lib/content'

export default function robots(): MetadataRoute.Robots {
  const artist = getArtistContent()
  const base = artist.canonicalUrl.replace(/\/$/, '')

  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${base}/sitemap.xml`,
    host: base,
  }
}
