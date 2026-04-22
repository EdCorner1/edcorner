import { NextResponse } from 'next/server'
import { hasAdminSession } from '@/lib/admin-auth'
import { getAdminSupabase, STORAGE_BUCKET } from '@/lib/admin-supabase'

const ALLOWED_TYPES = [
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/gif',
  'image/svg+xml',
  'video/mp4',
  'video/quicktime',
  'video/webm',
]

const MAX_SIZE = 250 * 1024 * 1024 // 250MB

export async function POST(request: Request) {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const folder = (formData.get('folder') as string) || 'misc'

    if (!file) {
      return NextResponse.json({ error: 'No file provided.' }, { status: 400 })
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: `Unsupported file type: ${file.type}` }, { status: 400 })
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'File too large. Max 250MB.' }, { status: 400 })
    }

    // Sanitize filename: replace spaces, keep extension
    const ext = file.name.split('.').pop()?.toLowerCase() || 'bin'
    const baseName = file.name.replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '-').toLowerCase()
    const timestamp = Date.now()
    const storagePath = `${folder}/${baseName}-${timestamp}.${ext}`

    const adminSupabase = getAdminSupabase()
    const { data, error } = await adminSupabase.storage
      .from(STORAGE_BUCKET)
      .upload(storagePath, file, {
        contentType: file.type,
        upsert: false,
      })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Get the public URL
    const { data: urlData } = adminSupabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(storagePath)

    return NextResponse.json({
      path: storagePath,
      url: urlData?.publicUrl ?? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${storagePath}`,
      size: file.size,
      type: file.type,
    })
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
    const path = searchParams.get('path')

    if (!path) {
      return NextResponse.json({ error: 'Missing path parameter.' }, { status: 400 })
    }

    const adminSupabase = getAdminSupabase()
    const { error } = await adminSupabase.storage
      .from(STORAGE_BUCKET)
      .remove([path])

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unexpected error.' },
      { status: 500 }
    )
  }
}