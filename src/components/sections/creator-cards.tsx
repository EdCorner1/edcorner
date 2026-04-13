type CreatorCardItem = {
  icon: string
  label: string
  title: string
  description: string
}

type CreatorCardsProps = {
  headline: string
  items: readonly CreatorCardItem[]
}

export default function CreatorCards({ headline, items }: CreatorCardsProps) {
  return (
    <section className="portfolio-section-wrap" id="about" aria-label={headline}>
      <h2 className="portfolio-headline">{headline}</h2>

      <div className="portfolio-grid">
        {items.map((item) => (
          <article key={item.title} className="portfolio-card">
            <span className="portfolio-icon" aria-hidden="true">{item.icon}</span>
            <div className="portfolio-label">{item.label}</div>
            <h3 className="portfolio-title">{item.title}</h3>
            <p className="portfolio-description">{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
