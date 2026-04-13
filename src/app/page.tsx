import ContentTabs from '@/components/sections/content-tabs'
import CreatorCards from '@/components/sections/creator-cards'
import VideoTicker from '@/components/sections/video-ticker'
import SiteFooter from '@/components/sections/site-footer'
import BentoGrid from '@/components/sections/bento-grid'
import ReviewsTicker from '@/components/sections/reviews-ticker'
import FaqSection from '@/components/sections/faq-section'
import ContactSection from '@/components/sections/contact-section'
import { homeContent } from '@/content/home-content'

export default function HomePage() {
  const { hero, metrics, categories, videos, brands, videoTicker, creatorCards, contentTabs } = homeContent
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

      <VideoTicker videos={videoTicker.videos} />
      <CreatorCards headline={creatorCards.headline} items={creatorCards.items} />
      <ContentTabs headline={contentTabs.headline} tabs={contentTabs.tabs} />
      <ReviewsTicker />
      <BentoGrid headline={homeContent.bentoGrid.headline} />
      <FaqSection />
      <ContactSection />
      <SiteFooter />
    </>
  )
}
