'use client'

import { useState, useEffect } from 'react'

declare global {
  interface Window {
    Cal?: (cmd: string, ...args: unknown[]) => void
  }
}

export default function ContactSection() {
  const [form, setForm] = useState({ name: '', email: '', project: '' })
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    // Load Cal.com inline embed — runs after DOM is ready
    const existingScript = document.getElementById('cal-inline-script')
    if (existingScript) return

    const script = document.createElement('script')
    script.id = 'cal-inline-script'
    script.src = 'https://app.cal.com/embed/embed.js'
    script.async = true
    script.onload = () => {
      if (window.Cal) {
        window.Cal('init', '30min', { origin: 'https://app.cal.com' })
        window.Cal('ns', '30min', 'inline', {
          elementOrSelector: '#my-cal-inline-30min',
          calLink: 'edcorner/30min',
          config: {
            layout: 'month_view',
            useSlotsViewOnSmallScreen: true,
          },
        })
        window.Cal('ns', '30min', 'ui', {
          cssVarsPerTheme: {
            light: { calBrand: '#CCFF00' },
          },
          layout: 'month_view',
        })
      }
    }
    document.head.appendChild(script)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <section className="contact-section" id="getintouch">
      <h2 className="contact-headline">Have a project in mind?</h2>

      <div className="contact-grid">
        {/* Contact Form */}
        <div className="contact-form-wrap">
          {submitted ? (
            <div className="contact-success">
              <div className="contact-success-icon">✓</div>
              <h3>Message sent!</h3>
              <p>I&apos;ll reply within 24 hours.</p>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="contact-name">Name</label>
                <input
                  id="contact-name"
                  type="text"
                  placeholder="Dwayne Johnson"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="contact-email">Email</label>
                <input
                  id="contact-email"
                  type="email"
                  placeholder="Paper@scissors.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="contact-project">Project Information</label>
                <textarea
                  id="contact-project"
                  placeholder="I&apos;m building..."
                  rows={5}
                  value={form.project}
                  onChange={(e) => setForm({ ...form, project: e.target.value })}
                  required
                />
              </div>

              <button type="submit" className="contact-submit">
                Submit
              </button>

              <p className="contact-note">I usually reply within 24hrs</p>
            </form>
          )}
        </div>

        {/* Cal.com inline embed */}
        <div className="contact-calendar-wrap">
          <div
            id="my-cal-inline-30min"
            style={{ width: '100%', height: '100%', minHeight: '600px' }}
          />
        </div>
      </div>
    </section>
  )
}
