'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* ── Header wrapper ── */}
      <div className="relative mx-auto my-1 w-[96%] max-w-[1400px] h-16 z-[999]">
        {/* SVG border frame */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
          style={{ borderRadius: '100px' }}
        >
          <rect
            x="0.5"
            y="0.5"
            width="calc(100% - 1px)"
            height="calc(100% - 1px)"
            rx="63.5"
            ry="63.5"
            fill="none"
            stroke="rgba(51,51,51,0.2)"
            strokeWidth="1"
          />
          <rect
            x="0.5"
            y="0.5"
            width="calc(100% - 1px)"
            height="calc(100% - 1px)"
            rx="63.5"
            ry="63.5"
            fill="none"
            stroke="#39FF14"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray="150, 3000"
            className="animate-[trace-header_8s_linear_infinite]"
          />
        </svg>

        {/* Nav content */}
        <nav className="relative h-full px-9 flex items-center justify-between rounded-full backdrop-blur-md bg-white/[0.01]">
          {/* Logo + name */}
          <Link href="/" className="flex items-center gap-2.5 no-underline">
            <span
              style={{
                fontFamily: "'Bricolage Grotesque', sans-serif",
                fontVariationSettings: '"wdth" 100',
                fontWeight: 800,
                fontSize: 24,
                color: '#333',
                letterSpacing: '-0.03em',
              }}
            >
              Ed Corner
            </span>
            <span className="relative flex items-center justify-center w-3 h-3">
              <span className="absolute w-2 h-2 bg-[#39FF14] rounded-full" />
              <span
                className="absolute w-2 h-2 bg-[#39FF14] rounded-full animate-[pulse-dot_2s_ease-out_infinite]"
                style={{ animationDelay: '0s' }}
              />
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-9">
            {[
              { label: 'Work', href: '#work' },
              { label: 'FAQ', href: '#faq' },
              { label: 'About', href: '#about' },
            ].map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="text-[15px] text-[#333] no-underline transition-colors hover:text-[#39FF14]"
                style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="relative hidden md:inline-block rounded-full overflow-hidden">
            {/* Rotating conic gradient border */}
            <span
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'conic-gradient(transparent, rgba(51,51,51,0.4) 15%, transparent 25%)',
                animation: 'rotate-comet 3s linear infinite',
              }}
            />
            <Link
              href="#contact"
              className="relative block px-6 py-2.5 rounded-full bg-[#ccff00] text-[#333] text-sm font-bold no-underline"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif", zIndex: 2 }}
            >
              Get in touch
            </Link>
          </div>

          {/* Mobile burger */}
          <button
            className="md:hidden bg-none border-none cursor-pointer p-0"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <span className="block w-5 h-px bg-[#333] mb-1.5" />
            <span className="block w-5 h-px bg-[#333] mb-1.5" />
            <span className="block w-5 h-px bg-[#333]" />
          </button>
        </nav>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden relative mx-auto w-[96%] rounded-3xl bg-white border border-[#e8e8e4] p-6 z-50">
          <div className="flex flex-col gap-5">
            {['Work', 'FAQ', 'About'].map((label) => (
              <Link
                key={label}
                href={`#${label.toLowerCase()}`}
                className="text-base text-[#333] no-underline"
                onClick={() => setMobileOpen(false)}
              >
                {label}
              </Link>
            ))}
            <Link
              href="#contact"
              className="inline-block text-center px-6 py-3 rounded-full bg-[#ccff00] text-[#333] font-bold text-sm no-underline"
              onClick={() => setMobileOpen(false)}
            >
              Get in touch
            </Link>
          </div>
        </div>
      )}

      <style>{`
        @keyframes trace-header {
          from { stroke-dashoffset: 3000; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes rotate-comet {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse-dot {
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(3.5); opacity: 0; }
        }
      `}</style>
    </>
  )
}