'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import type { MediaContent } from '@/lib/types'
import { Section } from '@/components/Section'

function getYoutubeEmbedUrl(url: string): string {
  if (!url.includes('youtube.com') && !url.includes('youtu.be')) return url

  try {
    const parsed = new URL(url)
    const videoId = parsed.hostname.includes('youtu.be') ? parsed.pathname.slice(1) : parsed.searchParams.get('v') || ''
    if (!videoId) return url

    return `https://www.youtube-nocookie.com/embed/${videoId}`
  } catch {
    return url
  }
}

export function Gallery({ media }: { media: MediaContent }) {
  const [activePhotoId, setActivePhotoId] = useState<string | null>(null)

  const activePhoto = useMemo(
    () => media.photos.find((photo) => photo.id === activePhotoId) ?? null,
    [media.photos, activePhotoId],
  )

  return (
    <Section id="media" cardClassName="p-0">
      <div className="border-b border-[var(--border)] px-4 py-4 md:px-8">
        <p className="kicker">Media</p>
        <h2 className="title-block mt-2">Visual Archive</h2>
      </div>

      {media.videos.length > 0 ? (
        <div className="grid gap-0 border-b border-[var(--border)] md:grid-cols-2">
          <article className="border-b border-[var(--border)] md:border-b-0 md:border-r">
            {media.videos[0].type === 'youtube' ? (
              <iframe
                title={media.videos[0].title}
                src={getYoutubeEmbedUrl(media.videos[0].url)}
                className="aspect-video w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : (
              <video controls preload="none" className="aspect-video w-full" poster={media.videos[0].poster} src={media.videos[0].url} />
            )}
          </article>

          {media.videos[1] ? (
            <article className="relative overflow-hidden bg-[var(--accent)]">
              <div className="mask-peanut absolute left-1/2 top-1/2 h-[78%] w-[88%] -translate-x-1/2 -translate-y-1/2 overflow-hidden border border-black/35">
                {media.videos[1].type === 'youtube' ? (
                  <iframe
                    title={media.videos[1].title}
                    src={getYoutubeEmbedUrl(media.videos[1].url)}
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                ) : (
                  <video controls preload="none" className="h-full w-full object-cover" poster={media.videos[1].poster} src={media.videos[1].url} />
                )}
              </div>
            </article>
          ) : null}
        </div>
      ) : null}

      {media.photos.length > 0 ? (
        <div className="grid grid-cols-2 gap-0 md:grid-cols-4">
          {media.photos.map((photo, index) => (
            <button
              key={photo.id}
              type="button"
              onClick={() => setActivePhotoId(photo.id)}
              className={`overflow-hidden border-[var(--border)] ${
                index % 4 !== 3 ? 'md:border-r' : ''
              } ${index < media.photos.length - 2 ? 'border-b md:border-b-0' : ''}`}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                className="aspect-square h-full w-full object-cover transition duration-300 hover:scale-105"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </button>
          ))}
        </div>
      ) : null}

      {activePhoto ? (
        <button
          type="button"
          onClick={() => setActivePhotoId(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          aria-label="Close image preview"
        >
          <Image
            src={activePhoto.src}
            alt={activePhoto.alt}
            width={activePhoto.width}
            height={activePhoto.height}
            className="max-h-[90vh] w-auto rounded-xl border border-[var(--border)]"
            sizes="90vw"
          />
        </button>
      ) : null}
    </Section>
  )
}
