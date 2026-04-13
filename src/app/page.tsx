import ContentTabs from '@/components/sections/content-tabs'
import CreatorCards from '@/components/sections/creator-cards'
import VideoTicker from '@/components/sections/video-ticker'
import SiteFooter from '@/components/sections/site-footer'
import BentoGrid from '@/components/sections/bento-grid'
import ReviewsTicker from '@/components/sections/reviews-ticker'
import FaqSection from '@/components/sections/faq-section'
import ContactSection from '@/components/sections/contact-section'
import { homeContent } from '@/content/home-content'
import { getVideosByCategory, getTickerVideos, supabase } from '@/lib/supabase'
import type { DbVideo } from '@/lib/supabase'

export const revalidate = 3600 // Rebuild every hour (ISR)

// Static category order matching the site's original flow
const CATEGORY_ORDER = ['Travel', 'Apps', 'Tech', 'Health & Fitness', 'AI']

function seededShuffle<T>(items: T[], seed: string): T[] {
  const arr = [...items]
  let hash = 2166136261
  for (let i = 0; i < seed.length; i++) {
    hash ^= seed.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  let seedNum = hash >>> 0
  for (let i = arr.length - 1; i > 0; i--) {
    seedNum = (seedNum * 1664525 + 1013904223) >>> 0
    const j = seedNum % (i + 1)
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

export default async function HomePage() {
  // Fetch all videos from Supabase
  const allVideos = await getVideosByCategory()

  // Build ticker: featured videos + random selection, shuffled
  const featuredUrls = Object.values(allVideos)
    .flat()
    .filter(v => v.featured)
    .map(v => v.url)

  const allUrls = Object.values(allVideos).flat().map(v => v.url)
  const tickerVideos = seededShuffle(
    [...new Set(allUrls)],
    allUrls.join('|')
  ).slice(0, 12)

  const tickerUrls = tickerVideos as unknown as readonly string[]

  // Build dynamic content tabs in category order
  const dynamicTabs = CATEGORY_ORDER
    .filter(cat => allVideos[cat]?.length > 0)
    .map(category => ({
      id: category.toLowerCase().replace(/ & /g, '-'),
      label: category,
      videos: allVideos[category]
        .sort((a: DbVideo, b: DbVideo) => a.sort_order - b.sort_order)
        .slice(0, 12)
        .map(v => ({ url: v.url, uploadedAt: v.uploaded_at })),
    }))

  const { hero, metrics, categories, videos, brands, creatorCards } = homeContent
  const logos = brands.logos as ReadonlyArray<{ name: string; src: string }>
  const logoItems = [...logos, ...logos]

  return (
    <>
      <section className="hero" id="top">
        <div className="hero-left">
          <div className="deal-badge">{hero.dealBadge}</div>

          <div className="intro-row">
            <span>{hero.introName}</span>
            <img className="intro-avatar" src={hero.avatarUrl} alt={hero.avatarAlt} />
          </div>

          <h1>
            {hero.titleLine1}
            <br />
            {hero.titleLine2}
          </h1>

          <p className="hero-copy">{hero.copy}</p>

          <div className="hero-ctas">
            <a className="btn-neon" href={hero.cta.href}>{hero.cta.label}</a>
          </div>
        </div>

        <div className="hero-right" id="projects">
          <div className="hero-responsive-wrap" id="portfolio">
            <div className="cluster-container">
              <div className="ui-blob views-blob">
                <div style={{ fontSize: 34, fontWeight: 800, lineHeight: 1 }}>{metrics.monthlyViews}</div>
                <div style={{ fontSize: 9, color: '#666', textTransform: 'uppercase' }}>
                  {metrics.monthlyViewsLabel}
                </div>
              </div>

              <div className="pill-column">
                {categories.map((category) => (
                  <div key={category} className="pill">{category}</div>
                ))}
              </div>

              <div className="vid-card v1">
                <video loop muted playsInline autoPlay>
                  <source src={videos.primary} type="video/mp4" />
                </video>
              </div>

              <div className="vid-card v2">
                <video loop muted playsInline preload="none">
                  <source src={videos.secondary} type="video/mp4" />
                </video>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="brands-section" aria-label="Brands ticker">
        <h2>{brands.title}</h2>

        <div className="brands-ticker" role="presentation">
          <div className="brands-track">
            {logoItems.map((brand, index) => (
              <div className="brand-logo-item" key={`${brand.name}-${index}`} aria-label={brand.name}>
                {brand.src ? (
                  <img src={brand.src} alt={brand.name} loading="lazy" />
                ) : (
                  <span>{brand.name}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <VideoTicker videos={tickerUrls} />
      <CreatorCards headline={creatorCards.headline} items={creatorCards.items} />

      {dynamicTabs.length > 0 && (
        <ContentTabs
          headline={homeContent.contentTabs.headline}
          tabs={dynamicTabs as unknown as readonly { id: string; label: string; videos: readonly { url: string; uploadedAt: string }[] }[]}
        />
      )}

      <ReviewsTicker />
      <BentoGrid headline={homeContent.bentoGrid.headline} />
      <FaqSection />
      <ContactSection />
      <SiteFooter />
    </>
  )
}
