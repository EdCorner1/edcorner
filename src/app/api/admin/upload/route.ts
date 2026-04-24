import { NextResponse } from 'next/server'
import { hasAdminSession } from '@/lib/admin-auth'
import { getAdminSupabase, STORAGE_BUCKET } from '@/lib/admin-supabase'

const ALLOWED_MIME_TO_EXTENSIONS: Record<string, string[]> = {
  'image/png': ['png'],
  'image/jpeg': ['jpg', 'jpeg'],
  'image/webp': ['webp'],
  'image/gif': ['gif'],
  'image/svg+xml': ['svg'],
  'video/mp4': ['mp4'],
  'video/quicktime': ['mov', 'qt'],
  'video/webm': ['webm'],
}

const ALLOWED_FOLDERS = new Set(['videos', 'logos', 'avatar', 'hero-videos', 'misc'])
const MAX_SIZE = 250 * 1024 * 1024 // 250MB

function sanitizeFolder(input: string) {
  const normalized = input.trim().toLowerCase().replace(/[^a-z0-9-]/g, '')
  return ALLOWED_FOLDERS.has(normalized) ? normalized : 'misc'
}

function sanitizeFilename(input: string) {
  return input
    .replace(/\.[^.]+$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-') || 'file'
}

export async function POST(request: Request) {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const folder = sanitizeFolder((formData.get('folder') as string) || 'misc')

    if (!file) {
      return NextResponse.json({ error: 'No file provided.' }, { status: 400 })
    }

    const allowedExtensions = ALLOWED_MIME_TO_EXTENSIONS[file.type]
    if (!allowedExtensions) {
      return NextResponse.json({ error: `Unsupported file type: ${file.type}` }, { status: 400 })
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'File too large. Max 250MB.' }, { status: 400 })
    }

    const rawExt = file.name.split('.').pop()?.toLowerCase() || ''
    const ext = allowedExtensions.includes(rawExt) ? rawExt : allowedExtensions[0]
    const baseName = sanitizeFilename(file.name)
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
      name: file.name,
      folder,
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

    if (path.includes('..')) {
      return NextResponse.json({ error: 'Invalid path.' }, { status: 400 })
    }

    const [folder] = path.split('/')
    if (!folder || !ALLOWED_FOLDERS.has(folder)) {
      return NextResponse.json({ error: 'Invalid folder path.' }, { status: 400 })
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