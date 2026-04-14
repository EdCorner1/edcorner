'use client'

import { useState } from 'react'

export default function ContactSection() {
  const [form, setForm] = useState({ name: '', email: '', project: '' })
  const [submitted, setSubmitted] = useState(false)

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
                <input id="contact-name" type="text" placeholder="Dwayne Johnson"
                  value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label htmlFor="contact-email">Email</label>
                <input id="contact-email" type="email" placeholder="Paper@scissors.com"
                  value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              </div>
              <div className="form-group">
                <label htmlFor="contact-project">Project Information</label>
                <textarea id="contact-project" placeholder="I&apos;m building..." rows={5}
                  value={form.project} onChange={(e) => setForm({ ...form, project: e.target.value })} required />
              </div>
              <button type="submit" className="contact-submit">Submit</button>
              <p className="contact-note">I usually reply within 24hrs</p>
            </form>
          )}
        </div>

        {/* Cal.com inline booking — uses Cal.com's direct embed pattern */}
        <div className="contact-calendar-wrap">
          <div style={{ width: '100%', height: '100%', overflow: 'auto' }}>
            <iframe
              src="https://app.cal.com/schedules/edcorner/30min?embedType=Inline&amp;hideEventTypeDetails=false&amp;layout=month_view"
              width="100%"
              height="700"
              frameBorder="0"
              title="Book a call with Ed"
              loading="lazy"
              style={{ borderRadius: '0', background: 'transparent' }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}