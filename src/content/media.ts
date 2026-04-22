export type MediaSource = 'wordpress' | 'local' | 'cdn'

/**
 * Switch MEDIA_SOURCE to 'cdn' when using Supabase storage.
 * The admin CMS writes to site_config + edcorner-media bucket,
 * so the homepage reads dynamically from Supabase.
 * This file is kept for the SiteHeader avatar fallback only.
 */
export const MEDIA_SOURCE: MediaSource = 'cdn'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const STORAGE_BUCKET = 'edcorner-media'
const WORDPRESS_UPLOADS_BASE = 'https://edcorner.co.uk/wp-content/uploads'
const LOCAL_MEDIA_BASE = '/media'
const CDN_MEDIA_BASE = `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}`

function mediaUrl(path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`

  if (MEDIA_SOURCE === 'local') return `${LOCAL_MEDIA_BASE}${normalizedPath}`
  if (MEDIA_SOURCE === 'cdn') return `${CDN_MEDIA_BASE}${normalizedPath}`
  return `${WORDPRESS_UPLOADS_BASE}${normalizedPath}`
}

export const mediaAssets = {
  avatar: mediaUrl('/avatar/ed-avatar.png'),
  heroVideoPrimary: mediaUrl('/hero-videos/hero-primary.mp4'),
  heroVideoSecondary: mediaUrl('/hero-videos/hero-secondary.mp4'),
} as const