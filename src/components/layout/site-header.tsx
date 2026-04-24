'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const DEFAULT_AVATAR = `${SUPABASE_URL}/storage/v1/object/public/edcorner-media/avatar/ed-avatar.png`

export default function SiteHeader() {
  const [open, setOpen] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState<string>(DEFAULT_AVATAR)

  useEffect(() => {
    // Fetch the latest profile avatar from site_config
    fetch('/api/site-config/profile')
      .then((res) => res.json())
      .then((data) => {
        if (data?.avatarUrl) setAvatarUrl(data.avatarUrl)
      })
      .catch(() => {
        // Use default avatar
      })
  }, [])

  return (
    <header className="header-system-wrapper">
      <div className="header-shell">
        <div className="header-left-pill">
          <Link href="#top" className="header-avatar-link" onClick={() => setOpen(false)} aria-label="Back to top">
            <img src={avatarUrl} alt="Ed" className="header-avatar" />
          </Link>

          <nav className={`nav-links-bricolage ${open ? 'active' : ''}`} id="nav-drawer" aria-label="Main navigation">
            <Link href="#portfolio" onClick={() => setOpen(false)}>Work</Link>
            <Link href="#about" onClick={() => setOpen(false)}>Services</Link>
            <Link href="#faq" onClick={() => setOpen(false)}>FAQ</Link>
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
            aria-label="Book a discovery call"
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