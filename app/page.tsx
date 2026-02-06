import { AboutSection } from '@/components/AboutSection'
import { AudioPlayer } from '@/components/AudioPlayer'
import { AudioPlayerProvider } from '@/lib/audio-store'
import { ContactSection } from '@/components/ContactSection'
import { Header } from '@/components/Header'
import { Hero } from '@/components/Hero'
import { ScrollFade } from '@/components/ScrollFade'
import { ShowList } from '@/components/ShowList'
import { TrackList } from '@/components/TrackList'
import { getArtistContent, getShows, getTracks } from '@/lib/content'
import { buildEventJsonLd, buildMusicRecordingJsonLd } from '@/lib/seo'

export default function HomePage() {
  const artist = getArtistContent()
  const tracks = getTracks()
  const shows = getShows()

  const recordingsJsonLd = buildMusicRecordingJsonLd(artist, tracks)
  const eventsJsonLd = buildEventJsonLd(shows)

  return (
    <AudioPlayerProvider tracks={tracks}>
      <Header artistName={artist.wordmarkText} />
      <main id="main-content" className="pb-4">
        <ScrollFade mode="out">
          <Hero artist={artist} featuredTrack={tracks[0]} />
        </ScrollFade>

        <ScrollFade mode="out" minScale={1} yOffset={0}>
          <div className="marquee-band">
            <div className="marquee-track">
              <span>
                {artist.wordmarkText} • AVAILABLE NOW • {artist.wordmarkText} • AVAILABLE NOW • {artist.wordmarkText} • AVAILABLE NOW •
              </span>
              <span aria-hidden="true">
                {artist.wordmarkText} • AVAILABLE NOW • {artist.wordmarkText} • AVAILABLE NOW • {artist.wordmarkText} • AVAILABLE NOW •
              </span>
            </div>
          </div>
        </ScrollFade>

        <ScrollFade mode="out">
          <AboutSection artist={artist} />
        </ScrollFade>
        <ScrollFade mode="out">
          <TrackList tracks={tracks} />
        </ScrollFade>
        <ScrollFade mode="in">
          <ShowList shows={shows} />
        </ScrollFade>
        <ScrollFade mode="in">
          <ContactSection artist={artist} />
        </ScrollFade>
      </main>
      <AudioPlayer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(recordingsJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(eventsJsonLd) }} />
    </AudioPlayerProvider>
  )
}
