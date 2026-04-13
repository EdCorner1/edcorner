'use client'

import { useMemo, useState } from 'react'

type TabVideo = {
  url: string
  uploadedAt: string
}

type ContentTab = {
  id: string
  label: string
  videos: readonly TabVideo[]
}

type ContentTabsProps = {
  headline: string
  tabs: readonly ContentTab[]
}

export default function ContentTabs({ headline, tabs }: ContentTabsProps) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id ?? '')

  const current = tabs.find((tab) => tab.id === activeTab) ?? tabs[0]

  const visibleVideos = useMemo(() => {
    if (!current) return [] as TabVideo[]

    return [...current.videos]
      .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
      .slice(0, 12)
  }, [current])

  if (!tabs.length || !current) return null

  return (
    <section className="content-tabs-section" aria-label={headline}>
      <h2>{headline}</h2>

      <div className="content-tabs-nav" role="tablist" aria-label="Video categories">
        {tabs.map((tab) => {
          const isActive = tab.id === current.id
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`content-tab-btn ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      <div className="content-tabs-grid" role="tabpanel" aria-label={current.label}>
        {visibleVideos.map((video, index) => (
          <article className="content-tab-video" key={`${current.id}-${video.url}-${index}`}>
            <video src={`${video.url}#t=1`} controls playsInline preload="metadata" />
          </article>
        ))}
      </div>
    </section>
  )
}
