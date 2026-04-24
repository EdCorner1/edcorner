interface Project {
  icon: string
  label: string
  title: string
  description: string
  cta: string
  href: string
  badge?: string
}

const projects: Project[] = [
  {
    icon: '▶️',
    label: 'YouTube',
    title: 'Building a creator business with AI tools',
    description:
      'Behind-the-scenes videos on content systems, automation, and what is actually working right now for tech creators.',
    cta: 'Watch on YouTube',
    href: 'https://youtube.com/@thisisedcorner',
  },
  {
    icon: '📧',
    label: 'Newsletter',
    title: 'The Tech Creators Newsletter',
    description:
      'Weekly breakdowns on brand deals, winning hooks, and practical growth tactics for tech UGC creators.',
    cta: 'Subscribe free',
    href: 'https://newsletter.edcorner.co.uk',
  },
  {
    icon: '🎙️',
    label: 'Podcast',
    title: 'The Tech Creators Club',
    description:
      'Honest conversations with creators and founders about audience growth, monetisation, and building in public.',
    cta: 'Listen now',
    href: 'https://newsletter.edcorner.co.uk',
  },
  {
    icon: '⚡',
    label: 'Product',
    title: 'Otto UGC',
    description:
      'A marketplace for tech and AI UGC creators to find aligned brands, manage deals, and scale repeat work.',
    cta: 'Join waitlist',
    href: 'https://otto.edcorner.co.uk',
    badge: 'Coming soon',
  },
]

export default function BentoGrid({ headline }: { headline: string }) {
  return (
    <section className="bento-section">
      <h2 className="bento-headline">{headline}</h2>

      <div className="bento-grid">
        {projects.map((project) => (
          <a
            key={project.title}
            href={project.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`bento-card ${project.badge ? 'bento-card--upcoming' : ''}`}
          >
            {project.badge && <span className="bento-badge">{project.badge}</span>}

            <div className="bento-icon">{project.icon}</div>
            <div className="bento-label">{project.label}</div>
            <h3 className="bento-title">{project.title}</h3>
            <p className="bento-desc">{project.description}</p>

            <span className="bento-cta">
              {project.cta}
              <span className="bento-arrow">→</span>
            </span>
          </a>
        ))}
      </div>
    </section>
  )
}
