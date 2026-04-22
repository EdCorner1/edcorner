import { NextResponse } from 'next/server'
import { hasAdminSession } from '@/lib/admin-auth'
import { getAdminSupabase } from '@/lib/admin-supabase'
import type { SiteConfigId } from '@/lib/supabase'

const VALID_IDS: SiteConfigId[] = ['hero', 'profile', 'brands', 'metrics', 'videos']

export async function GET() {
  try {
    const adminSupabase = getAdminSupabase()
    const { data, error } = await adminSupabase
      .from('site_config')
      .select('id, value, updated_at')

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ config: data })
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

    const adminSupabase = getAdminSupabase()
    const { error } = await adminSupabase
      .from('site_config')
      .upsert({ id, value }, { onConflict: 'id' })

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