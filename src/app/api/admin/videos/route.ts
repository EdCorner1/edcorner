import { NextResponse } from 'next/server'
import { hasAdminSession } from '@/lib/admin-auth'
import { getAdminSupabase } from '@/lib/admin-supabase'
import { VIDEO_BASE_COLUMNS } from '@/lib/supabase'

type VideoPayload = {
  id?: string
  title?: string | null
  caption?: string | null
  category?: string
  url?: string
  featured?: boolean
  sort_order?: number
  storage_path?: string | null
}

const SELECT_COLUMNS = VIDEO_BASE_COLUMNS.join(',')

async function fetchAllVideos() {
  const adminSupabase = getAdminSupabase()
  const { data, error } = await adminSupabase
    .from('videos')
    .select(SELECT_COLUMNS)
    .order('sort_order', { ascending: true })
    .order('uploaded_at', { ascending: false })

  if (error) {
    throw error
  }

  return data ?? []
}

function normalizePayload(payload: VideoPayload) {
  return {
    title: payload.title ?? null,
    caption: payload.caption ?? null,
    category: payload.category?.trim(),
    url: payload.url?.trim(),
    featured: Boolean(payload.featured),
    sort_order: Number(payload.sort_order ?? 0) || 0,
    storage_path: payload.storage_path ?? null,
  }
}

function validatePayload(payload: ReturnType<typeof normalizePayload>) {
  if (!payload.category) return 'Category is required.'
  if (!payload.url) return 'Video URL is required.'
  return null
}

export async function POST(request: Request) {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = (await request.json()) as VideoPayload
    const payload = normalizePayload(body)
    const validationError = validatePayload(payload)

    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 })
    }

    const adminSupabase = getAdminSupabase()
    const { error } = await adminSupabase.from('videos').insert(payload)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ videos: await fetchAllVideos() })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unexpected error.' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = (await request.json()) as VideoPayload

    if (!body.id) {
      return NextResponse.json({ error: 'Missing video id.' }, { status: 400 })
    }

    const payload = normalizePayload(body)
    const validationError = validatePayload(payload)

    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 })
    }

    const adminSupabase = getAdminSupabase()
    const { error } = await adminSupabase.from('videos').update(payload).eq('id', body.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ videos: await fetchAllVideos() })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unexpected error.' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Missing video id.' }, { status: 400 })
    }

    const adminSupabase = getAdminSupabase()
    const { error } = await adminSupabase.from('videos').delete().eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ videos: await fetchAllVideos() })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unexpected error.' },
      { status: 500 }
    )
  }
}
