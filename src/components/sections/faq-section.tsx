'use client'

import { useState } from 'react'

const faqs = [
  {
    q: 'So what actually is UGC?',
    a: "UGC stands for User Generated Content. It's video content created by real people — not actors, not polished ads — that feels like something a friend would send you. Brands love it because it cuts through the ad noise. I love it because it pays.",
  },
  {
    q: 'Are you like an influencer?',
    a: "Sort of, but different. Influencers build audiences and post brand content to their own followers. I create content for brands — they use it in their ads, on their website, across their channels. My face, their product, their campaign.",
  },
  {
    q: "Where do you buy all your hats from?",
    a: "Everywhere. Zara, Cos, Asos, Amazon, markets. I've been asked about three specific hats this month so I'm starting to think I have a problem.",
  },
  {
    q: "What kind of content do you make?",
    a: "Short form mostly — TikToks, YouTube Shorts, Instagram Reels. But I've done longer tutorials, product demo reels, LinkedIn content, and testimonial-style pieces. If it fits in a vertical frame and holds attention, I'm in.",
  },
  {
    q: "So do we post on my account or yours?",
    a: "Depends on the brief. Usually the brand gets the rights to use the content in their own ads — that means paid social, website, email. Sometimes we post to my profile as well, which gives it extra reach. We'll agree on the usage in the proposal.",
  },
  {
    q: "How do you measure success?",
    a: "Views, engagement, click-throughs, conversions — whatever the campaign goal is. I track everything and report back at the end. If the content isn't performing, I'll tell you why and what we'd change next time.",
  },
  {
    q: "How quickly can you turn content around?",
    a: "My standard turnaround is 3–5 days from brief to finished files. Rush turnarounds can usually be accommodated — just ask upfront and I'll let you know what's possible.",
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
