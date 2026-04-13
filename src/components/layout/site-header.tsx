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
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>

        <div className="header-actions">
          <Link href="#getintouch" className="book-call-btn" onClick={() => setOpen(false)}>
            Book a call
          </Link>
          <Link href="#getintouch" className="mail-btn" aria-label="Email Ed" onClick={() => setOpen(false)}>
            ✉
          </Link>
        </div>
      </div>
    </header>
  )
}
