'use client'

import Link from 'next/link'
import { useState } from 'react'
import { mediaAssets } from '@/content/media'

export default function SiteHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header className="header-system-wrapper">
      <div className="header-shell">
        <div className="header-left-pill">
          <Link href="#top" className="header-avatar-link" onClick={() => setOpen(false)} aria-label="Back to top">
            <img src={mediaAssets.avatar} alt="Ed" className="header-avatar" />
          </Link>

          <nav className={`nav-links-bricolage ${open ? 'active' : ''}`} id="nav-drawer" aria-label="Main navigation">
            <Link href="#portfolio" onClick={() => setOpen(false)}>Recent Work</Link>
            <Link href="#about" onClick={() => setOpen(false)}>About Me</Link>
            <Link href="#getintouch" onClick={() => setOpen(false)}>Contact</Link>
          </nav>

          <button
            className="mobile-btn"
            aria-label="Toggle menu"
            aria-expanded={open}
            aria-controls="nav-drawer"
            onClick={() => setOpen((v) => !v)}
            type="button"
          >
            <span />
            <span />
            <span />
          </button>
        </div>

        <div className="header-actions">
          <button
            className="book-call-btn"
            data-cal-link="edcorner/30min"
            data-cal-namespace="30min"
            data-cal-config='{"layout":"month_view","useSlotsViewOnSmallScreen":true}'
            style={{ border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit' }}
            type="button"
          >
            Book a call
          </button>
          <a
            href="mailto:hello@edcorner.co.uk"
            className="mail-btn"
            aria-label="Email Ed"
            style={{ fontSize: '35px', lineHeight: 1, padding: '0 14px' }}
          >
            ✉
          </a>
        </div>
      </div>
    </header>
  )
}
