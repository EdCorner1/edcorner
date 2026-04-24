import Link from 'next/link'
import ContentTabs from '@/components/sections/content-tabs'
import CreatorCards from '@/components/sections/creator-cards'
import VideoTicker from '@/components/sections/video-ticker'
import SiteFooter from '@/components/sections/site-footer'
import BentoGrid from '@/components/sections/bento-grid'
import ReviewsTicker from '@/components/sections/reviews-ticker'
import FaqSection from '@/components/sections/faq-section'
import ContactSection from '@/components/sections/contact-section'
import {
  getVideosByCategory,
  getAllSiteConfig,
} from '@/lib/supabase'
import type { DbVideo } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

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

/* Fallback content if Supabase config is empty */
const FALLBACK = {
  hero: {
    dealBadge: '🟢 Completed 50+ brand deals ~ 6 active clients',
    introName: "Hi, I'm Ed",
    titleLine1: 'UGC & Tech',
    titleLine2: 'Creator',
    copy: 'I create performance-driven UGC for AI, app, and SaaS brands — built to hold attention and convert across paid and organic channels.',
    ctaLabel: 'Get in touch',
    ctaHref: '#getintouch',
  },
  profile: {
    avatarUrl: '',
    avatarAlt: 'Ed profile',
  },
  brands: {
    title: 'Proudly working with…',
    logos: [] as { name: string; src: string }[],
  },
  metrics: {
    monthlyViews: '600K+',
    monthlyViewsLabel: 'Monthly Views',
  },
  categories: ['💪 Health & Fitness', '📱 Apps', '🔧 Tech', '🧠 AI', '✈️ Travel'],
}

export default async function HomePage() {
  const [allVideos, siteConfig] = await Promise.all([
    getVideosByCategory(),
    getAllSiteConfig(),
  ])

  // Resolve config with fallbacks
  const hero = { ...FALLBACK.hero, ...(siteConfig.hero || {}) } as typeof FALLBACK.hero & Record<string, unknown>
  const profile = { ...FALLBACK.profile, ...(siteConfig.profile || {}) } as typeof FALLBACK.profile & Record<string, unknown>
  const brands = { ...FALLBACK.brands, ...(siteConfig.brands || {}) } as typeof FALLBACK.brands & Record<string, unknown>
  const metrics = { ...FALLBACK.metrics, ...(siteConfig.metrics || {}) } as typeof FALLBACK.metrics & Record<string, unknown>
  const heroVideos = (siteConfig.videos || {}) as Record<string, unknown>

  // Resolve avatar URL — prefer Supabase storage, then config value, then fallback
  const avatarUrl =
    profile.avatarUrl ||
    'https://bdilsklxylaswursilnl.supabase.co/storage/v1/object/public/edcorner-media/avatar/ed-avatar.png'

  // Build video content tabs from Supabase data
  const dynamicTabs = CATEGORY_ORDER
    .filter((cat) => allVideos[cat]?.length > 0)
    .map((category) => ({
      id: category.toLowerCase().replace(/ & /g, '-'),
      label: category,
      videos: allVideos[category]
        .sort((a: DbVideo, b: DbVideo) => a.sort_order - b.sort_order)
        .slice(0, 12)
        .map((v) => ({ url: v.url, uploadedAt: v.uploaded_at })),
    }))

  // Build ticker from all video URLs
  const allUrls = Object.values(allVideos).flat().map((v) => v.url)
  const tickerVideos = seededShuffle([...new Set(allUrls)], allUrls.join('|')).slice(0, 12) as string[]

  // Resolve hero videos — prefer config, then fallback to Supabase videos, then empty
  const primaryVideo = String(heroVideos.primaryUrl || '') || (allUrls.length > 0 ? allUrls[0] : '')
  const secondaryVideo = String(heroVideos.secondaryUrl || '') || (allUrls.length > 1 ? allUrls[1] : '')

  // Build brand logos with duplication for ticker effect
  const brandLogos = Array.isArray(brands.logos) ? brands.logos : []
  const logoItems = brandLogos.length > 0 ? [...brandLogos, ...brandLogos] : []

  // Categories from video data or fallback
  const categories = dynamicTabs.length > 0
    ? dynamicTabs.map((t) => t.label)
    : FALLBACK.categories

  return (
    <>
      <section className="hero" id="top">
        <div className="hero-left">
          <div className="deal-badge">{String(hero.dealBadge)}</div>

          <div className="intro-row">
            <span>{String(hero.introName)}</span>
            <img className="intro-avatar" src={avatarUrl} alt={String(profile.avatarAlt)} />
          </div>

          <h1>
            {String(hero.titleLine1)}
            <br />
            {String(hero.titleLine2)}
          </h1>

          <p className="hero-copy">{String(hero.copy)}</p>

          <div className="hero-ctas">
            <a className="btn-neon" href={String(hero.ctaHref)}>{String(hero.ctaLabel)}</a>
            <Link className="btn-ghost" href="#portfolio">View recent work</Link>
          </div>
        </div>

        <div className="hero-right" id="projects">
          <div className="hero-responsive-wrap" id="portfolio">
            <div className="cluster-container">
              <div className="ui-blob views-blob">
                <div style={{ fontSize: 34, fontWeight: 800, lineHeight: 1 }}>{String(metrics.monthlyViews)}</div>
                <div style={{ fontSize: 9, color: '#666', textTransform: 'uppercase' }}>
                  {String(metrics.monthlyViewsLabel)}
                </div>
              </div>

              <div className="pill-column">
                {categories.map((category) => (
                  <div key={category} className="pill">{category}</div>
                ))}
              </div>

              {primaryVideo && (
                <div className="vid-card v1">
                  <video loop muted playsInline autoPlay>
                    <source src={primaryVideo} type="video/mp4" />
                  </video>
                </div>
              )}

              {secondaryVideo && (
                <div className="vid-card v2">
                  <video loop muted playsInline preload="none">
                    <source src={secondaryVideo} type="video/mp4" />
                  </video>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {logoItems.length > 0 && (
        <section className="brands-section" aria-label="Brands ticker">
          <h2>{String(brands.title)}</h2>

          <div className="brands-ticker" role="presentation">
            <div className="brands-track">
              {logoItems.map((brand: { name: string; src: string }, index: number) => (
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
      )}

      {tickerVideos.length > 0 && (
        <VideoTicker videos={tickerVideos} />
      )}

      <CreatorCards
        headline="How I help brands win with UGC"
        items={[
          {
            icon: '🎬',
            label: 'Creative',
            title: 'Scroll-stopping vertical videos',
            description: 'Native-feeling TikToks, Reels, and Shorts that blend into the feed, hook fast, and make the product the hero.',
          },
          {
            icon: '🧠',
            label: 'Strategy',
            title: 'Message-market fit before filming',
            description: 'Each concept is built around audience pains, objections, and outcomes so the final cut is designed to convert — not just entertain.',
          },
          {
            icon: '🤝',
            label: 'Execution',
            title: 'Reliable partner, not a one-off creator',
            description: 'Fast communication, clean handover, and reusable assets your team can run across paid social, landing pages, and email.',
          },
        ]}
      />

      {dynamicTabs.length > 0 && (
        <ContentTabs
          headline="Content that connects"
          tabs={dynamicTabs as unknown as readonly { id: string; label: string; videos: readonly { url: string; uploadedAt: string }[] }[]}
        />
      )}

      <ReviewsTicker />
      <BentoGrid headline="Explore more from Ed" />
      <FaqSection />
      <ContactSection />
      <SiteFooter />
    </>
  )
}