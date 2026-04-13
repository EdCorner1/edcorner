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
    title: 'Letting Openclaw Control My Life for 30 Days',
    description:
      "I'm handing my daily operations to an AI for 30 days — building, shipping, and automating everything with OpenClaw. Follow the experiment on YouTube.",
    cta: 'Watch on YouTube',
    href: 'https://youtube.com/@thisisedcorner',
  },
  {
    icon: '📧',
    label: 'Newsletter',
    title: 'The Tech Creators Newsletter',
    description:
      "Weekly drops on what's working in tech UGC — brand deals, creator tactics, AI tools, and opportunities you can actually act on.",
    cta: 'Subscribe free',
    href: 'https://newsletter.edcorner.co.uk',
  },
  {
    icon: '🎙️',
    label: 'Podcast',
    title: 'The Tech Creators Club',
    description:
      'Conversations with top UGC creators and tech founders. Learn how they built their audiences, landed deals, and think about content.',
    cta: 'Listen now',
    href: 'https://newsletter.edcorner.co.uk',
  },
  {
    icon: '⚡',
    label: 'Coming Soon',
    title: 'Otto UGC',
    description:
      'A UGC marketplace built specifically for tech and AI creators. Connect with brands, manage deals, and grow your creator business — all in one place.',
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
