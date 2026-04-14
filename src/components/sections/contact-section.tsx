'use client'

import { useEffect, useState } from 'react'

declare global {
  interface Window {
    Cal?: ((cmd: string, ...args: unknown[]) => void) & {
      ns?: Record<string, (...args: unknown[]) => void>
    }
    __edCalInlineReady?: boolean
  }
}

export default function ContactSection() {
  const [form, setForm] = useState({ name: '', email: '', project: '' })
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    let cancelled = false
    let attempts = 0

    const initInline = () => {
      if (cancelled || window.__edCalInlineReady) return

      const cal = window.Cal
      const container = document.getElementById('my-cal-inline-30min')

      if (!cal || !container) {
        if (attempts < 40) {
          attempts += 1
          window.setTimeout(initInline, 250)
        }
        return
      }

      try {
        cal('init', '30min', { origin: 'https://app.cal.com' })
        cal.ns?.['30min']?.('inline', {
          elementOrSelector: '#my-cal-inline-30min',
          calLink: 'edcorner/30min',
          config: {
            layout: 'month_view',
            useSlotsViewOnSmallScreen: true,
          },
        })
        cal.ns?.['30min']?.('ui', {
          hideEventTypeDetails: false,
          layout: 'month_view',
        })
        window.__edCalInlineReady = true
      } catch {
        if (attempts < 40) {
          attempts += 1
          window.setTimeout(initInline, 250)
        }
      }
    }

    initInline()
    return () => {
      cancelled = true
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const subject = encodeURIComponent(`Website enquiry from ${form.name}`)
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\n\nProject information:\n${form.project}`
    )

    window.location.href = `mailto:hello@edcorner.co.uk?subject=${subject}&body=${body}`
    setSubmitted(true)
  }

  return (
    <section className="contact-section" id="getintouch">
      <h2 className="contact-headline">Have a project in mind?</h2>

      <div className="contact-grid">
        <div className="contact-form-wrap">
          {submitted ? (
            <div className="contact-success">
              <div className="contact-success-icon">✓</div>
              <h3>Email draft opened</h3>
              <p>If your mail app didn&apos;t open, email hello@edcorner.co.uk directly.</p>
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
                  placeholder="paper@scissors.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="contact-project">Project Information</label>
                <textarea
                  id="contact-project"
                  placeholder="Tell me what you need, your timeline, and the kind of content you want."
                  rows={5}
                  value={form.project}
                  onChange={(e) => setForm({ ...form, project: e.target.value })}
                  required
                />
              </div>
              <button type="submit" className="contact-submit">Send via email</button>
              <p className="contact-note">This opens your email app with the details filled in.</p>
            </form>
          )}
        </div>

        <div className="contact-calendar-wrap">
          <div id="my-cal-inline-30min" className="cal-com-embed" />
        </div>
      </div>
    </section>
  )
}
