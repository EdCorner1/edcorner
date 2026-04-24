'use client'

import { useState } from 'react'

const faqs = [
  {
    q: 'What does working together look like?',
    a: 'You send the brief, goals, and product context. I handle concepting, scripting, filming, and edits, then deliver ready-to-use assets in vertical formats.',
  },
  {
    q: 'What types of brands do you work best with?',
    a: 'Mostly AI, SaaS, mobile app, and tech-enabled consumer brands that care about performance and want creative that feels native to the platform.',
  },
  {
    q: 'What deliverables can you provide?',
    a: 'Hook-first ad creatives, organic-style UGC, product demos, testimonials, voiceover variants, and cutdowns for testing different angles.',
  },
  {
    q: 'Can we run this as paid media?',
    a: 'Yes. Most clients license content for paid social, landing pages, and email campaigns. Usage rights and term length are agreed before production.',
  },
  {
    q: 'How fast is turnaround?',
    a: 'Standard turnaround is 3–5 days from approved brief. Rush delivery is possible depending on schedule and project scope.',
  },
  {
    q: 'How do you measure success?',
    a: 'Success is tied to your objective: watch time, CTR, CVR, CPA, or revenue. We align on KPIs upfront and iterate based on real performance data.',
  },
  {
    q: 'How do we get started?',
    a: 'Use the contact form or book a call. I will review your goals and propose a clear scope, timeline, and pricing before anything starts.',
  },
]

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="faq-section" id="faq">
      <div className="faq-inner">
        <div className="faq-header">
          <p className="faq-eyebrow">FAQ</p>
          <h2 className="faq-headline">Before you ask</h2>
        </div>

        <div className="faq-list">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className={`faq-item ${openIndex === i ? 'faq-item--open' : ''}`}
            >
              <button
                type="button"
                className="faq-question"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                aria-expanded={openIndex === i}
              >
                <span>{faq.q}</span>
                <span className="faq-icon" aria-hidden="true">
                  {openIndex === i ? '−' : '+'}
                </span>
              </button>
              {openIndex === i && (
                <div className="faq-answer">
                  <p>{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
