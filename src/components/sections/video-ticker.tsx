'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

type VideoTickerProps = {
  videos: readonly string[]
  count?: number
}

function hashString(value: string): number {
  let hash = 2166136261
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

function seededShuffle<T>(items: readonly T[], seedInput: string): T[] {
  const arr = [...items]
  let seed = hashString(seedInput) || 1
  for (let i = arr.length - 1; i > 0; i -= 1) {
    seed = (seed * 1664525 + 1013904223) >>> 0
    const j = seed % (i + 1)
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

export default function VideoTicker({ videos, count = 9 }: VideoTickerProps) {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { threshold: 0.1 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const selected = useMemo(() => {
    if (!videos?.length) return [] as string[]
    const shuffled = seededShuffle(videos, videos.join('|'))
    return shuffled.slice(0, Math.min(count, videos.length))
  }, [videos, count])

  if (!selected.length) return null

  const loopItems = [...selected, ...selected]

  return (
    <section ref={sectionRef} className="video-ticker-wrap" aria-label="Video ticker">
      <div className="video-ticker-track" role="presentation">
        {loopItems.map((url, index) => (
          <div className="video-item" key={`${url}-${index}`}>
            <video
              src={url}
              autoPlay={isVisible}
              loop
              muted
              playsInline
              preload={isVisible ? 'metadata' : 'none'}
            />
          </div>
        ))}
      </div>
    </section>
  )
}
