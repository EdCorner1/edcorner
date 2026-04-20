'use client'

import { useMemo, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import type { DbVideo } from '@/lib/supabase'

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

type VideoCmsProps = {
  initialVideos: DbVideo[]
}

const DEFAULT_FORM: VideoFormState = {
  title: '',
  caption: '',
  category: 'Tech',
  url: '',
  featured: false,
  sort_order: 0,
  storage_path: '',
}

const CATEGORY_OPTIONS = ['Travel', 'Apps', 'Tech', 'Health & Fitness', 'AI'] as const

function mapVideoToForm(video: DbVideo): VideoFormState {
  return {
    id: video.id,
    title: video.title ?? '',
    caption: video.caption ?? '',
    category: video.category,
    url: video.url,
    featured: video.featured,
    sort_order: video.sort_order ?? 0,
    storage_path: video.storage_path ?? '',
  }
}

function formatDate(date: string) {
  try {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(date))
  } catch {
    return date
  }
}

export default function VideoCms({ initialVideos }: VideoCmsProps) {
  const router = useRouter()
  const [videos, setVideos] = useState(initialVideos)
  const [form, setForm] = useState<VideoFormState>(DEFAULT_FORM)
  const [status, setStatus] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const featuredCount = useMemo(() => videos.filter((video) => video.featured).length, [videos])
  const categoryCount = useMemo(() => new Set(videos.map((video) => video.category)).size, [videos])

  function resetForm() {
    setForm(DEFAULT_FORM)
  }

  function beginEdit(video: DbVideo) {
    setForm(mapVideoToForm(video))
    setStatus(`Editing “${video.title || video.url}”`)
    setError(null)
  }

  async function submitForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setStatus(null)

    const method = form.id ? 'PATCH' : 'POST'
    const response = await fetch('/api/admin/videos', {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...form,
        title: form.title.trim() || null,
        caption: form.caption.trim() || null,
        category: form.category.trim(),
        url: form.url.trim(),
        storage_path: form.storage_path.trim() || null,
        sort_order: Number(form.sort_order) || 0,
      }),
    })

    const payload = await response.json().catch(() => null)

    if (!response.ok) {
      setError(payload?.error ?? 'Could not save the video.')
      return
    }

    const nextVideos = (payload?.videos ?? []) as DbVideo[]
    setVideos(nextVideos)
    setStatus(form.id ? 'Video updated.' : 'Video created.')
    resetForm()

    startTransition(() => {
      router.refresh()
    })
  }

  async function handleDelete(id: string) {
    const confirmed = window.confirm('Delete this video record? This cannot be undone.')
    if (!confirmed) return

    setError(null)
    setStatus(null)

    const response = await fetch(`/api/admin/videos?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
    })

    const payload = await response.json().catch(() => null)

    if (!response.ok) {
      setError(payload?.error ?? 'Could not delete the video.')
      return
    }

    setVideos((payload?.videos ?? []) as DbVideo[])
    setStatus('Video deleted.')

    if (form.id === id) {
      resetForm()
    }

    startTransition(() => {
      router.refresh()
    })
  }

  async function signOut() {
    await supabaseSignOut()
    await fetch('/api/admin/session', { method: 'DELETE' })
    router.replace('/login')
    router.refresh()
  }

  return (
    <section className="admin-shell">
      <div className="admin-page-header">
        <div>
          <span className="admin-eyebrow">Private dashboard</span>
          <h1>Video CMS</h1>
          <p>Manage the videos powering the homepage ticker and category tabs.</p>
        </div>

        <div className="admin-header-actions">
          <div className="admin-stat-card">
            <strong>{videos.length}</strong>
            <span>Total videos</span>
          </div>
          <div className="admin-stat-card">
            <strong>{featuredCount}</strong>
            <span>Featured</span>
          </div>
          <div className="admin-stat-card">
            <strong>{categoryCount}</strong>
            <span>Categories</span>
          </div>
          <button className="admin-secondary-btn" type="button" onClick={signOut}>
            Log out
          </button>
        </div>
      </div>

      <div className="admin-grid">
        <form className="admin-panel admin-video-form" onSubmit={submitForm}>
          <div className="admin-panel-header">
            <div>
              <h2>{form.id ? 'Edit video' : 'Add a new video'}</h2>
              <p>Paste a hosted video URL now. Keep a storage path ready for uploads later.</p>
            </div>
            {form.id ? (
              <button className="admin-text-btn" type="button" onClick={resetForm}>
                New entry
              </button>
            ) : null}
          </div>

          <div className="admin-form-grid">
            <label className="admin-field admin-field-full">
              <span>Video URL</span>
              <input
                placeholder="https://.../video.mp4"
                type="url"
                value={form.url}
                onChange={(event) => setForm((current) => ({ ...current, url: event.target.value }))}
                required
              />
            </label>

            <label className="admin-field">
              <span>Title</span>
              <input
                placeholder="AI app demo"
                value={form.title}
                onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
              />
            </label>

            <label className="admin-field">
              <span>Category</span>
              <select
                value={form.category}
                onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}
              >
                {CATEGORY_OPTIONS.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>

            <label className="admin-field admin-field-full">
              <span>Caption</span>
              <textarea
                placeholder="Quick context for this video"
                rows={4}
                value={form.caption}
                onChange={(event) => setForm((current) => ({ ...current, caption: event.target.value }))}
              />
            </label>

            <label className="admin-field">
              <span>Sort order</span>
              <input
                type="number"
                value={form.sort_order}
                onChange={(event) => setForm((current) => ({ ...current, sort_order: Number(event.target.value) }))}
              />
            </label>

            <label className="admin-field">
              <span>Storage path</span>
              <input
                placeholder="videos/airalo/video-1.mp4"
                value={form.storage_path}
                onChange={(event) => setForm((current) => ({ ...current, storage_path: event.target.value }))}
              />
            </label>
          </div>

          <label className="admin-checkbox-row">
            <input
              checked={form.featured}
              type="checkbox"
              onChange={(event) => setForm((current) => ({ ...current, featured: event.target.checked }))}
            />
            <span>Feature this video in the homepage pool</span>
          </label>

          {error ? <p className="admin-form-error">{error}</p> : null}
          {status ? <p className="admin-form-status">{status}</p> : null}

          <button className="admin-primary-btn" type="submit" disabled={isPending}>
            {form.id ? 'Save changes' : 'Create video'}
          </button>
        </form>

        <div className="admin-panel admin-video-list-panel">
          <div className="admin-panel-header">
            <div>
              <h2>Existing videos</h2>
              <p>Sorted the same way the homepage uses them.</p>
            </div>
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
                      <h3>{video.title || 'Untitled video'}</h3>
                      <p>{video.category} • Order {video.sort_order}</p>
                    </div>
                    {video.featured ? <span className="admin-tag">Featured</span> : null}
                  </div>

                  <p className="admin-video-caption">{video.caption || 'No caption added yet.'}</p>

                  <div className="admin-video-details">
                    <span>Published {formatDate(video.uploaded_at)}</span>
                    {video.storage_path ? <span>Storage: {video.storage_path}</span> : <span>No storage path yet</span>}
                  </div>

                  <div className="admin-card-actions">
                    <button className="admin-secondary-btn" type="button" onClick={() => beginEdit(video)}>
                      Edit
                    </button>
                    <button className="admin-danger-btn" type="button" onClick={() => handleDelete(video.id)}>
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

async function supabaseSignOut() {
  const { supabase } = await import('@/lib/supabase')
  await supabase.auth.signOut()
}
