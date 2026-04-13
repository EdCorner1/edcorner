export type MediaSource = 'wordpress' | 'local' | 'cdn'

/**
 * Switch this when you're ready to move away from WordPress-hosted assets.
 * - 'wordpress' (current)
 * - 'local' (files in /public/media/...)
 * - 'cdn' (Cloudflare Stream, Mux, Vimeo, or another CDN)
 */
export const MEDIA_SOURCE: MediaSource = 'wordpress'

const WORDPRESS_UPLOADS_BASE = 'https://edcorner.co.uk/wp-content/uploads'
const LOCAL_MEDIA_BASE = '/media'
const CDN_MEDIA_BASE = ''

function mediaUrl(path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`

  if (MEDIA_SOURCE === 'local') return `${LOCAL_MEDIA_BASE}${normalizedPath}`
  if (MEDIA_SOURCE === 'cdn') return `${CDN_MEDIA_BASE}${normalizedPath}`
  return `${WORDPRESS_UPLOADS_BASE}${normalizedPath}`
}

export const mediaAssets = {
  avatar: mediaUrl('/2026/03/cropped-Untitled-design-6.png'),
  heroVideoPrimary: mediaUrl('/2026/03/d7c359c0cf243f029082205768b75922-1.mp4'),
  heroVideoSecondary: mediaUrl('/2026/02/Video-1-with-captions.mp4'),
} as const
