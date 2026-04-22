import { NextResponse } from 'next/server'
import { hasAdminSession } from '@/lib/admin-auth'
import { getAdminSupabase, STORAGE_BUCKET } from '@/lib/admin-supabase'
import { SITE_CONFIG_PATH, type SiteConfigId } from '@/lib/supabase'

const VALID_IDS: SiteConfigId[] = ['hero', 'profile', 'brands', 'metrics', 'videos']

type SiteConfigMap = Partial<Record<SiteConfigId, Record<string, unknown>>>

async function readConfigFromStorage() {
  const adminSupabase = getAdminSupabase()
  const { data, error } = await adminSupabase.storage.from(STORAGE_BUCKET).download(SITE_CONFIG_PATH)

  if (error || !data) return {} as SiteConfigMap

  try {
    const text = await data.text()
    if (!text?.trim()) return {} as SiteConfigMap
    const parsed = JSON.parse(text)
    return (parsed && typeof parsed === 'object' ? parsed : {}) as SiteConfigMap
  } catch {
    return {} as SiteConfigMap
  }
}

async function writeConfigToStorage(config: SiteConfigMap) {
  const adminSupabase = getAdminSupabase()
  const body = JSON.stringify(config, null, 2)

  const { error } = await adminSupabase.storage
    .from(STORAGE_BUCKET)
    .upload(SITE_CONFIG_PATH, body, {
      contentType: 'application/json',
      upsert: true,
    })

  if (error) throw error
}

export async function GET() {
  try {
    const config = await readConfigFromStorage()
    return NextResponse.json({ config })
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
    const body = await request.json()
    const { id, value } = body as { id: string; value: Record<string, unknown> }

    if (!id || !VALID_IDS.includes(id as SiteConfigId)) {
      return NextResponse.json({ error: `Invalid config id. Must be one of: ${VALID_IDS.join(', ')}` }, { status: 400 })
    }

    if (!value || typeof value !== 'object') {
      return NextResponse.json({ error: 'value must be a JSON object' }, { status: 400 })
    }

    const current = await readConfigFromStorage()
    current[id as SiteConfigId] = value
    await writeConfigToStorage(current)

    return NextResponse.json({ ok: true, config: current })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unexpected error.' },
      { status: 500 }
    )
  }
}