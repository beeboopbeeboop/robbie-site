import 'server-only'
import fs from 'node:fs'
import path from 'node:path'
import type { ArtistContent, MediaContent, MediaPhoto, MediaVideo, Show, Track } from '@/lib/types'

const CONTENT_DIR = path.join(process.cwd(), 'content')

function readJsonFile(fileName: string): unknown {
  const filePath = path.join(CONTENT_DIR, fileName)
  try {
    const raw = fs.readFileSync(filePath, 'utf8')
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function asString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback
}

function asNumber(value: unknown, fallback = 0): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value.filter((item): item is string => typeof item === 'string')
}

export function getArtistContent(): ArtistContent {
  const payload = readJsonFile('artist.json')

  if (!isRecord(payload)) {
    return {
      name: 'Robbie Lune',
      wordmarkText: 'Robbie Lune',
      tagline: 'Intimate folk-pop songs for quiet rooms and long drives.',
      canonicalUrl: 'https://example.com',
      bookingEmail: 'booking@example.com',
      newsletterUrl: '',
      socials: {},
      bio: [],
      pressQuotes: [],
    }
  }

  const socialsPayload = isRecord(payload.socials) ? payload.socials : {}

  return {
    name: asString(payload.name, 'Robbie Lune'),
    wordmarkText: asString(payload.wordmarkText, asString(payload.name, 'Robbie Lune')),
    tagline: asString(payload.tagline),
    canonicalUrl: asString(payload.canonicalUrl, 'https://example.com'),
    bookingEmail: asString(payload.bookingEmail, 'booking@example.com'),
    newsletterUrl: asString(payload.newsletterUrl),
    socials: {
      instagram: asString(socialsPayload.instagram),
      tiktok: asString(socialsPayload.tiktok),
      youtube: asString(socialsPayload.youtube),
      spotify: asString(socialsPayload.spotify),
      appleMusic: asString(socialsPayload.appleMusic),
      bandcamp: asString(socialsPayload.bandcamp),
    },
    bio: asStringArray(payload.bio),
    pressQuotes: Array.isArray(payload.pressQuotes)
      ? payload.pressQuotes
          .filter(isRecord)
          .map((quote) => ({ quote: asString(quote.quote), source: asString(quote.source) }))
          .filter((quote) => quote.quote && quote.source)
      : [],
  }
}

export function getTracks(): Track[] {
  const payload = readJsonFile('tracks.json')
  if (!Array.isArray(payload)) return []

  return payload
    .filter(isRecord)
    .map((track) => {
      const linksPayload = isRecord(track.links) ? track.links : {}

      return {
        id: asString(track.id),
        title: asString(track.title),
        note: asString(track.note),
        audioUrl: asString(track.audioUrl),
        coverImage: asString(track.coverImage),
        duration: asNumber(track.duration),
        links: {
          spotify: asString(linksPayload.spotify),
          apple: asString(linksPayload.apple),
          youtube: asString(linksPayload.youtube),
          bandcamp: asString(linksPayload.bandcamp),
        },
      }
    })
    .filter((track) => track.id && track.title && track.audioUrl && track.coverImage)
}

export function getShows(): Show[] {
  const payload = readJsonFile('shows.json')
  if (!Array.isArray(payload)) return []

  return payload
    .filter(isRecord)
    .map<Show>((show) => ({
      id: asString(show.id),
      dateISO: asString(show.dateISO),
      city: asString(show.city),
      venue: asString(show.venue),
      ticketUrl: asString(show.ticketUrl),
      status: show.status === 'past' ? 'past' : 'upcoming',
    }))
    .filter((show) => show.id && show.dateISO && show.city && show.venue)
}

export function getMediaContent(): MediaContent {
  const payload = readJsonFile('media.json')
  if (!isRecord(payload)) {
    return { videos: [], photos: [] }
  }

  const videos = Array.isArray(payload.videos)
    ? payload.videos
        .filter(isRecord)
        .map<MediaVideo>((video) => ({
          id: asString(video.id),
          type: video.type === 'youtube' ? 'youtube' : 'file',
          title: asString(video.title),
          url: asString(video.url),
          poster: asString(video.poster),
        }))
        .filter((video) => video.id && video.title && video.url)
    : []

  const photos = Array.isArray(payload.photos)
    ? payload.photos
        .filter(isRecord)
        .map<MediaPhoto>((photo) => ({
          id: asString(photo.id),
          src: asString(photo.src),
          alt: asString(photo.alt),
          width: asNumber(photo.width, 1200),
          height: asNumber(photo.height, 900),
        }))
        .filter((photo) => photo.id && photo.src && photo.alt)
    : []

  return { videos, photos }
}
