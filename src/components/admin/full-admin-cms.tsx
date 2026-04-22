'use client'

import { useMemo, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import type { DbVideo } from '@/lib/supabase'

type SiteConfig = Partial<Record<string, Record<string, unknown>>>

type VideoFormState = {
  id?: string
  title: string
  caption: string
  category: string
  url: string
  featured: boolean
  sort_order: number
  storage_path: string
}

type BrandLogo = {
  name: string
  src: string
}

const DEFAULT_VIDEO_FORM: VideoFormState = {
  title: '',
  caption: '',
  category: 'Tech',
  url: '',
  featured: false,
  sort_order: 0,
  storage_path: '',
}

const CATEGORY_OPTIONS = ['Travel', 'Apps', 'Tech', 'Health & Fitness', 'AI'] as const

const UPLOAD_FOLDERS = [
  { value: 'videos', label: 'Videos' },
  { value: 'logos', label: 'Brand Logos' },
  { value: 'avatar', label: 'Profile Photo' },
  { value: 'hero-videos', label: 'Hero Videos' },
  { value: 'misc', label: 'Other' },
]

type AdminView = 'videos' | 'site' | 'upload'

export default function FullAdminCms({
  initialVideos,
  initialConfig,
}: {
  initialVideos: DbVideo[]
  initialConfig: SiteConfig
}) {
  const router = useRouter()
  const [videos, setVideos] = useState(initialVideos)
  const [config, setConfig] = useState(initialConfig)
  const [view, setView] = useState<AdminView>('videos')
  const [status, setStatus] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  // Video form
  const [videoForm, setVideoForm] = useState<VideoFormState>(DEFAULT_VIDEO_FORM)

  // Site config forms
  const [heroForm, setHeroForm] = useState({
    dealBadge: String(config.hero?.dealBadge ?? ''),
    introName: String(config.hero?.introName ?? ''),
    titleLine1: String(config.hero?.titleLine1 ?? ''),
    titleLine2: String(config.hero?.titleLine2 ?? ''),
    copy: String(config.hero?.copy ?? ''),
    ctaLabel: String(config.hero?.ctaLabel ?? ''),
    ctaHref: String(config.hero?.ctaHref ?? ''),
  })

  const [profileForm, setProfileForm] = useState({
    avatarUrl: String(config.profile?.avatarUrl ?? ''),
    avatarAlt: String(config.profile?.avatarAlt ?? ''),
  })

  const [brandsForm, setBrandsForm] = useState<BrandLogo[]>(
    (config.brands?.logos as BrandLogo[]) || []
  )

  const [metricsForm, setMetricsForm] = useState({
    monthlyViews: String(config.metrics?.monthlyViews ?? ''),
    monthlyViewsLabel: String(config.metrics?.monthlyViewsLabel ?? ''),
  })

  const [heroVideoForm, setHeroVideoForm] = useState({
    primaryUrl: String(config.videos?.primaryUrl ?? ''),
    secondaryUrl: String(config.videos?.secondaryUrl ?? ''),
  })

  // Upload state
  const [uploadFolder, setUploadFolder] = useState('videos')
  const [uploading, setUploading] = useState(false)

  const featuredCount = useMemo(() => videos.filter((v) => v.featured).length, [videos])
  const categoryCount = useMemo(() => new Set(videos.map((v) => v.category)).size, [videos])

  function clearFeedback() {
    setStatus(null)
    setError(null)
  }

  /* ========== Video CRUD ========== */

  function resetVideoForm() {
    setVideoForm(DEFAULT_VIDEO_FORM)
  }

  function beginEditVideo(video: DbVideo) {
    setVideoForm({
      id: video.id,
      title: video.title ?? '',
      caption: video.caption ?? '',
      category: video.category,
      url: video.url,
      featured: video.featured,
      sort_order: video.sort_order ?? 0,
      storage_path: video.storage_path ?? '',
    })
  }

  async function submitVideoForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    clearFeedback()

    const method = videoForm.id ? 'PATCH' : 'POST'
    const response = await fetch('/api/admin/videos', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...videoForm,
        title: videoForm.title.trim() || null,
        caption: videoForm.caption.trim() || null,
        storage_path: videoForm.storage_path.trim() || null,
        sort_order: Number(videoForm.sort_order) || 0,
      }),
    })

    const payload = await response.json().catch(() => null)
    if (!response.ok) {
      setError(payload?.error ?? 'Could not save video.')
      return
    }

    setVideos((payload?.videos ?? []) as DbVideo[])
    setStatus(videoForm.id ? 'Video updated.' : 'Video created.')
    resetVideoForm()
    startTransition(() => router.refresh())
  }

  async function deleteVideo(id: string) {
    if (!window.confirm('Delete this video?')) return
    clearFeedback()

    const response = await fetch(`/api/admin/videos?id=${encodeURIComponent(id)}`, { method: 'DELETE' })
    const payload = await response.json().catch(() => null)
    if (!response.ok) {
      setError(payload?.error ?? 'Could not delete video.')
      return
    }

    setVideos((payload?.videos ?? []) as DbVideo[])
    setStatus('Video deleted.')
    if (videoForm.id === id) resetVideoForm()
    startTransition(() => router.refresh())
  }

  /* ========== Site Config ========== */

  async function saveConfig(id: string, value: Record<string, unknown>) {
    clearFeedback()
    const response = await fetch('/api/admin/config', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, value }),
    })

    const payload = await response.json().catch(() => null)
    if (!response.ok) {
      setError(payload?.error ?? 'Could not save config.')
      return false
    }

    setConfig((prev) => ({ ...prev, [id]: value }))
    setStatus(`${id} config saved.`)
    startTransition(() => router.refresh())
    return true
  }

  async function saveHero() {
    await saveConfig('hero', heroForm)
  }

  async function saveProfile() {
    await saveConfig('profile', profileForm)
  }

  async function saveBrands() {
    await saveConfig('brands', { title: 'Proudly working with…', logos: brandsForm })
  }

  async function saveMetrics() {
    await saveConfig('metrics', metricsForm)
  }

  async function saveHeroVideos() {
    await saveConfig('videos', heroVideoForm)
  }

  /* ========== Brand Logo helpers ========== */

  function addBrandLogo() {
    setBrandsForm((prev) => [...prev, { name: '', src: '' }])
  }

  function updateBrandLogo(index: number, field: 'name' | 'src', value: string) {
    setBrandsForm((prev) => {
      const next = [...prev]
      next[index] = { ...next[index], [field]: value }
      return next
    })
  }

  function removeBrandLogo(index: number) {
    setBrandsForm((prev) => prev.filter((_, i) => i !== index))
  }

  /* ========== File Upload ========== */

  async function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)
    clearFeedback()

    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', uploadFolder)

    try {
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })

      const payload = await response.json()
      if (!response.ok) {
        setError(payload.error ?? 'Upload failed.')
        setUploading(false)
        return
      }

      setStatus(`Uploaded to ${payload.path} — URL: ${payload.url}`)
      setUploading(false)

      // Auto-fill relevant form fields based on folder
      if (uploadFolder === 'avatar') {
        setProfileForm((prev) => ({ ...prev, avatarUrl: payload.url }))
      } else if (uploadFolder === 'hero-videos') {
        if (!heroVideoForm.primaryUrl) {
          setHeroVideoForm((prev) => ({ ...prev, primaryUrl: payload.url }))
        } else if (!heroVideoForm.secondaryUrl) {
          setHeroVideoForm((prev) => ({ ...prev, secondaryUrl: payload.url }))
        }
      } else if (uploadFolder === 'videos') {
        setVideoForm((prev) => ({ ...prev, url: payload.url, storage_path: payload.path }))
      } else if (uploadFolder === 'logos') {
        setBrandsForm((prev) => [...prev, { name: file.name.replace(/\.[^.]+$/, ''), src: payload.url }])
      }
    } catch {
      setError('Upload failed.')
      setUploading(false)
    }

    // Reset the file input
    event.target.value = ''
  }

  /* ========== Auth ========== */

  async function signOut() {
    await fetch('/api/admin/session', { method: 'DELETE' })
    router.replace('/login')
    router.refresh()
  }

  /* ========== Render ========== */

  const navItems: { id: AdminView; label: string }[] = [
    { id: 'videos', label: 'Videos' },
    { id: 'site', label: 'Site Content' },
    { id: 'upload', label: 'Upload Files' },
  ]

  return (
    <section className="admin-shell">
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <span className="admin-eyebrow">Private dashboard</span>
          <h1>Ed Corner CMS</h1>
          <p>Manage videos, brand logos, profile photo, and site content.</p>
        </div>

        <div className="admin-header-actions">
          <div className="admin-stat-card">
            <strong>{videos.length}</strong>
            <span>Videos</span>
          </div>
          <div className="admin-stat-card">
            <strong>{featuredCount}</strong>
            <span>Featured</span>
          </div>
          <div className="admin-stat-card">
            <strong>{brandsForm.length}</strong>
            <span>Logos</span>
          </div>
          <button className="admin-secondary-btn" type="button" onClick={signOut}>
            Log out
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="admin-nav-tabs">
        {navItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`admin-nav-tab ${view === item.id ? 'active' : ''}`}
            onClick={() => setView(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Feedback */}
      {error ? <p className="admin-form-error">{error}</p> : null}
      {status ? <p className="admin-form-status">{status}</p> : null}

      {/* ========== Videos Tab ========== */}
      {view === 'videos' && (
        <div className="admin-grid">
          <form className="admin-panel admin-video-form" onSubmit={submitVideoForm}>
            <div className="admin-panel-header">
              <h2>{videoForm.id ? 'Edit video' : 'Add a new video'}</h2>
              {videoForm.id ? (
                <button className="admin-text-btn" type="button" onClick={resetVideoForm}>
                  New entry
                </button>
              ) : null}
            </div>

            <div className="admin-form-grid">
              <label className="admin-field admin-field-full">
                <span>Video URL</span>
                <input
                  placeholder="https://.../video.mp4 — or use Upload tab"
                  type="url"
                  value={videoForm.url}
                  onChange={(e) => setVideoForm((c) => ({ ...c, url: e.target.value }))}
                  required
                />
              </label>

              <label className="admin-field">
                <span>Title</span>
                <input
                  placeholder="AI app demo"
                  value={videoForm.title}
                  onChange={(e) => setVideoForm((c) => ({ ...c, title: e.target.value }))}
                />
              </label>

              <label className="admin-field">
                <span>Category</span>
                <select
                  value={videoForm.category}
                  onChange={(e) => setVideoForm((c) => ({ ...c, category: e.target.value }))}
                >
                  {CATEGORY_OPTIONS.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </label>

              <label className="admin-field admin-field-full">
                <span>Caption</span>
                <textarea
                  placeholder="Quick context for this video"
                  rows={3}
                  value={videoForm.caption}
                  onChange={(e) => setVideoForm((c) => ({ ...c, caption: e.target.value }))}
                />
              </label>

              <label className="admin-field">
                <span>Sort order</span>
                <input
                  type="number"
                  value={videoForm.sort_order}
                  onChange={(e) => setVideoForm((c) => ({ ...c, sort_order: Number(e.target.value) }))}
                />
              </label>
            </div>

            <label className="admin-checkbox-row">
              <input
                checked={videoForm.featured}
                type="checkbox"
                onChange={(e) => setVideoForm((c) => ({ ...c, featured: e.target.checked }))}
              />
              <span>Feature in homepage pool</span>
            </label>

            <button className="admin-primary-btn" type="submit" disabled={isPending}>
              {videoForm.id ? 'Save changes' : 'Create video'}
            </button>
          </form>

          <div className="admin-panel admin-video-list-panel">
            <div className="admin-panel-header">
              <h2>Existing videos ({videos.length})</h2>
            </div>

            <div className="admin-video-list">
              {videos.map((video) => (
                <article key={video.id} className="admin-video-card">
                  <div className="admin-video-preview">
                    <video src={video.url} muted playsInline preload="metadata" controls={false} />
                  </div>
                  <div className="admin-video-meta">
                    <div className="admin-video-topline">
                      <div>
                        <h3>{video.title || 'Untitled'}</h3>
                        <p>{video.category} • Order {video.sort_order}</p>
                      </div>
                      {video.featured ? <span className="admin-tag">Featured</span> : null}
                    </div>
                    <div className="admin-card-actions">
                      <button className="admin-secondary-btn" type="button" onClick={() => beginEditVideo(video)}>
                        Edit
                      </button>
                      <button className="admin-danger-btn" type="button" onClick={() => deleteVideo(video.id)}>
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              ))}
              {videos.length === 0 && <p className="admin-empty">No videos yet. Add one above or use the Upload tab.</p>}
            </div>
          </div>
        </div>
      )}

      {/* ========== Site Content Tab ========== */}
      {view === 'site' && (
        <div className="admin-grid">
          {/* Profile Photo */}
          <div className="admin-panel">
            <h2>Profile Photo</h2>
            <p>Upload via the Upload tab (folder: avatar), then paste the URL here.</p>
            {profileForm.avatarUrl && (
              <div style={{ margin: '12px 0' }}>
                <img
                  src={profileForm.avatarUrl}
                  alt="Profile preview"
                  style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover' }}
                />
              </div>
            )}
            <label className="admin-field admin-field-full">
              <span>Avatar URL</span>
              <input
                placeholder="https://.../avatar.png"
                type="url"
                value={profileForm.avatarUrl}
                onChange={(e) => setProfileForm((c) => ({ ...c, avatarUrl: e.target.value }))}
              />
            </label>
            <label className="admin-field admin-field-full">
              <span>Alt text</span>
              <input
                value={profileForm.avatarAlt}
                onChange={(e) => setProfileForm((c) => ({ ...c, avatarAlt: e.target.value }))}
              />
            </label>
            <button className="admin-primary-btn" type="button" onClick={saveProfile}>
              Save profile photo
            </button>
          </div>

          {/* Hero Section */}
          <div className="admin-panel">
            <h2>Hero Section</h2>

            <div className="admin-form-grid">
              <label className="admin-field admin-field-full">
                <span>Deal badge</span>
                <input
                  value={heroForm.dealBadge}
                  onChange={(e) => setHeroForm((c) => ({ ...c, dealBadge: e.target.value }))}
                />
              </label>
              <label className="admin-field admin-field-full">
                <span>Intro line</span>
                <input
                  value={heroForm.introName}
                  onChange={(e) => setHeroForm((c) => ({ ...c, introName: e.target.value }))}
                />
              </label>
              <label className="admin-field">
                <span>Title line 1</span>
                <input
                  value={heroForm.titleLine1}
                  onChange={(e) => setHeroForm((c) => ({ ...c, titleLine1: e.target.value }))}
                />
              </label>
              <label className="admin-field">
                <span>Title line 2</span>
                <input
                  value={heroForm.titleLine2}
                  onChange={(e) => setHeroForm((c) => ({ ...c, titleLine2: e.target.value }))}
                />
              </label>
              <label className="admin-field admin-field-full">
                <span>Description</span>
                <textarea
                  rows={3}
                  value={heroForm.copy}
                  onChange={(e) => setHeroForm((c) => ({ ...c, copy: e.target.value }))}
                />
              </label>
              <label className="admin-field">
                <span>CTA label</span>
                <input
                  value={heroForm.ctaLabel}
                  onChange={(e) => setHeroForm((c) => ({ ...c, ctaLabel: e.target.value }))}
                />
              </label>
              <label className="admin-field">
                <span>CTA link</span>
                <input
                  value={heroForm.ctaHref}
                  onChange={(e) => setHeroForm((c) => ({ ...c, ctaHref: e.target.value }))}
                />
              </label>
            </div>
            <button className="admin-primary-btn" type="button" onClick={saveHero}>
              Save hero section
            </button>
          </div>

          {/* Metrics */}
          <div className="admin-panel">
            <h2>Metrics</h2>
            <div className="admin-form-grid">
              <label className="admin-field">
                <span>Monthly views</span>
                <input
                  value={metricsForm.monthlyViews}
                  onChange={(e) => setMetricsForm((c) => ({ ...c, monthlyViews: e.target.value }))}
                />
              </label>
              <label className="admin-field">
                <span>Label</span>
                <input
                  value={metricsForm.monthlyViewsLabel}
                  onChange={(e) => setMetricsForm((c) => ({ ...c, monthlyViewsLabel: e.target.value }))}
                />
              </label>
            </div>
            <button className="admin-primary-btn" type="button" onClick={saveMetrics}>
              Save metrics
            </button>
          </div>

          {/* Hero Videos */}
          <div className="admin-panel">
            <h2>Hero Videos</h2>
            <p>Upload via the Upload tab (folder: hero-videos), then paste the URLs here.</p>
            <div className="admin-form-grid">
              <label className="admin-field admin-field-full">
                <span>Primary video URL</span>
                <input
                  placeholder="https://.../video.mp4"
                  type="url"
                  value={heroVideoForm.primaryUrl}
                  onChange={(e) => setHeroVideoForm((c) => ({ ...c, primaryUrl: e.target.value }))}
                />
              </label>
              <label className="admin-field admin-field-full">
                <span>Secondary video URL</span>
                <input
                  placeholder="https://.../video.mp4"
                  type="url"
                  value={heroVideoForm.secondaryUrl}
                  onChange={(e) => setHeroVideoForm((c) => ({ ...c, secondaryUrl: e.target.value }))}
                />
              </label>
            </div>
            <button className="admin-primary-btn" type="button" onClick={saveHeroVideos}>
              Save hero videos
            </button>
          </div>

          {/* Brand Logos */}
          <div className="admin-panel" style={{ gridColumn: '1 / -1' }}>
            <h2>Brand Logos</h2>
            <p>Upload via the Upload tab (folder: logos). Logos will auto-populate here after upload.</p>

            <div className="admin-brand-list">
              {brandsForm.map((logo, index) => (
                <div key={index} className="admin-brand-row">
                  {logo.src && (
                    <img
                      src={logo.src}
                      alt={logo.name}
                      style={{ width: 48, height: 48, objectFit: 'contain', background: '#fff', borderRadius: 4, padding: 4 }}
                    />
                  )}
                  <input
                    placeholder="Brand name"
                    value={logo.name}
                    onChange={(e) => updateBrandLogo(index, 'name', e.target.value)}
                    className="admin-brand-input"
                  />
                  <input
                    placeholder="Logo URL"
                    value={logo.src}
                    onChange={(e) => updateBrandLogo(index, 'src', e.target.value)}
                    className="admin-brand-input admin-brand-url"
                  />
                  <button
                    className="admin-danger-btn admin-brand-remove"
                    type="button"
                    onClick={() => removeBrandLogo(index)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <button className="admin-secondary-btn" type="button" onClick={addBrandLogo} style={{ marginRight: 12 }}>
              + Add logo
            </button>
            <button className="admin-primary-btn" type="button" onClick={saveBrands}>
              Save brand logos
            </button>
          </div>
        </div>
      )}

      {/* ========== Upload Tab ========== */}
      {view === 'upload' && (
        <div className="admin-grid">
          <div className="admin-panel">
            <h2>Upload Files</h2>
            <p>Choose a folder, then drop a file. The URL will be generated automatically.</p>

            <label className="admin-field">
              <span>Destination folder</span>
              <select
                value={uploadFolder}
                onChange={(e) => setUploadFolder(e.target.value)}
              >
                {UPLOAD_FOLDERS.map((f) => (
                  <option key={f.value} value={f.value}>{f.label}</option>
                ))}
              </select>
            </label>

            <label className="admin-upload-zone">
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif,video/mp4,video/quicktime,video/webm"
                onChange={handleFileUpload}
                disabled={uploading}
                className="admin-upload-input"
              />
              <span className="admin-upload-label">
                {uploading ? 'Uploading…' : 'Click to select a file (or drag & drop)'}
              </span>
            </label>

            <div className="admin-upload-hint">
              <p><strong>Videos:</strong> Use folder "videos" — auto-fills the video form URL</p>
              <p><strong>Logos:</strong> Use folder "logos" — auto-adds to brand logos list</p>
              <p><strong>Profile photo:</strong> Use folder "avatar" — auto-fills the profile URL</p>
              <p><strong>Hero videos:</strong> Use folder "hero-videos" — auto-fills hero video URLs</p>
              <p>Max 50MB. Supported: PNG, JPEG, WebP, GIF, MP4, MOV, WebM</p>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}