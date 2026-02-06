import type { MetadataRoute } from 'next'
import { getArtistContent } from '@/lib/content'

export default function sitemap(): MetadataRoute.Sitemap {
  const artist = getArtistContent()
  const base = artist.canonicalUrl.replace(/\/$/, '')

  return [
    {
      url: `${base}/`,
      priority: 1,
      changeFrequency: 'weekly',
    },
  ]
}
