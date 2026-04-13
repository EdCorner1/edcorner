'use client'

import { useState } from 'react'

type FaqItem = {
  question: string
  answer: string
}

const faqs: FaqItem[] = [
  {
    question: 'What is UGC?',
    answer:
      'UGC stands for User Generated Content — but in the creator world it means brand-sponsored content that feels organic and authentic. Unlike traditional ads, UGC is created by real creators who genuinely use and believe in the product. It lives on the creator\'s platform (TikTok, Instagram, YouTube) and feels like content the audience already enjoys, not an interruption.',
  },
  {
    question: "Are you an influencer?",
    answer:
      "Not really — I don't do lifestyle influencing or vanity metrics. I make conversion-focused UGC that directly drives sales for brands. My content is built to educate, demonstrate, and persuade — not to showcase my personal brand. The goal is always the same: make the viewer want to buy.",
  },
  {
    question: 'What kind of content do you make?',
    answer:
      'Mainly vertical short-form video for TikTok, Reels, and Shorts — the formats with the highest organic reach right now. I also produce YouTube Shorts, long-form YouTube content, and video ads. My sweet spot is tech, AI tools, SaaS, and travel products.',
  },
  {
    question: 'So do we post on your account or yours?',
    answer:
      "Typically UGC lives on my account, which gives it authenticity. The brand gets a licence to use the content on their own channels too. This gives you the best of both worlds — my audience trust and reach, plus content you own and can repurpose.",
  },
  {
    question: 'How do you measure success?',
    answer:
      "Views, saves, shares, click-throughs, and ultimately conversions. I track performance closely and share weekly reports with every client. If content isn't performing, we iterate fast — the first 30 days are about finding what resonates and then scaling it.",
  },
  {
    question: 'How quickly can you turn content around?',
    answer:
      "For most campaigns I deliver within 48–72 hours of brief sign-off. For urgent launches I can move faster. The process is simple: brief → strategy call → content creation → delivery with full licence for brand use.",
  },
]

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="faq-section" id="faq">
      <h2 className="faq-headline">Before you ask</h2>

      <div className="faq-list">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className={`faq-item ${openIndex === index ? 'faq-item--open' : ''}`}
          >
            <button
              className="faq-question"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              aria-expanded={openIndex === index}
            >
              <span>{faq.question}</span>
              <span className="faq-icon" aria-hidden="true">
                {openIndex === index ? '−' : '+'}
              </span>
            </button>
            {openIndex === index && (
              <div className="faq-answer">
                <p>{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
