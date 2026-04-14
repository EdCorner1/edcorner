'use client'

import { useEffect } from 'react'

declare global {
  interface Window {
    Cal?: (cmd: string, ...args: unknown[]) => void
    calButtonInitialized?: boolean
  }
}

export default function SiteHeader() {
  useEffect(() => {
    const initCalButton = () => {
      if (window.calButtonInitialized) return
      window.calButtonInitialized = true

      const btn = document.querySelector('.book-call-btn') as HTMLButtonElement | null
      if (!btn) return

      btn.addEventListener('click', (e) => {
        e.preventDefault()
        if (window.Cal) {
          window.Cal('show', {
            calLink: 'edcorner/30min',
            layout: 'month_view',
          })
        } else {
          window.open('https://app.cal.com/edcorner/30min', '_blank')
        }
      })
    }

    // Wait for embed.js to be ready
    const checkAndInit = () => {
      if ((window as Window).Cal) {
        initCalButton()
      } else {
        setTimeout(checkAndInit, 100)
      }
    }

    // If embed.js already loaded
    if (document.getElementById('cal-embed-script')) {
      checkAndInit()
    } else {
      const s = document.createElement('script')
      s.id = 'cal-embed-script'
      s.src = 'https://app.cal.com/embed/embed.js'
      s.async = true
      s.onload = checkAndInit
      document.body.appendChild(s)
    }
  }, [])

  return (
    <header className="header-system-wrapper">
      <div className="header-shell">
        <div className="header-left-pill">
          <a href="#top" className="header-avatar-link" aria-label="Back to top">
            <img src="https://edcorner.co.uk/wp-content/uploads/2026/03/cropped-Untitled-design-6.png" alt="Ed" className="header-avatar" />
          </a>

          <nav className="nav-links-bricolage" id="nav-drawer" aria-label="Main navigation">
            <a href="#portfolio">Recent Work</a>
            <a href="#about">About Me</a>
            <a href="#getintouch">Contact</a>
          </nav>

          <button className="mobile-btn" aria-label="Toggle menu">
            <span />
            <span />
            <span />
          </button>
        </div>

        <div className="header-actions">
          <button className="book-call-btn" type="button">
            Book a call
          </button>
          <a
            href="mailto:hello@edcorner.co.uk"
            className="mail-btn"
            aria-label="Email Ed"
            style={{ fontSize: '20px', lineHeight: 1, padding: '0 14px' }}
          >
            ✉
          </a>
        </div>
      </div>
    </header>
  )
}