# Media Workflow (edcorner-site)

This site is currently configured to use **WordPress-hosted media**.

## Where to edit media links

Use these files:

- `src/content/media.ts` → source + raw asset paths
- `src/content/home-content.ts` → section content/copy that references those assets

For the logo ticker specifically:

- `src/content/home-content.ts` → `brands.logos` array
  - set `name` for alt/fallback text
  - set `src` to the logo URL (SVG/PNG with transparent background preferred)

For tabbed videos (`Content that connects`):

- `src/content/home-content.ts` → `contentTabs.tabs`
  - each video is `{ url, uploadedAt }`
  - videos auto-sort newest → oldest in the UI
  - max 12 videos shown per tab (4x3 on desktop)

## Quick update flow (current)

1. Upload image/video to WordPress Media Library
2. Copy the URL
3. In `src/content/media.ts`, replace the relevant path in `mediaAssets`
4. Save — page updates automatically in dev

---

## Switching away from WordPress later

In `src/content/media.ts`, change:

```ts
export const MEDIA_SOURCE: MediaSource = 'wordpress'
```

to either:

- `'local'` → serves from `public/media/...`
- `'cdn'` → serves from `CDN_MEDIA_BASE`

### Local mode

Put files in:

- `public/media/images/...`
- `public/media/videos/...`

Then reference paths like:

- `/images/avatar.png`
- `/videos/hero-01.mp4`

### CDN mode

Set:

```ts
const CDN_MEDIA_BASE = 'https://your-cdn-domain.com'
```

Then keep file paths in `mediaAssets` as normal.

---

## Recommendation for this project

Since this is video-heavy:

- Keep landing page content in code (`home-content.ts`)
- Move video hosting to a dedicated video platform when ready
  (Cloudflare Stream / Mux / Vimeo Pro)
- Keep short image assets local or on CDN
