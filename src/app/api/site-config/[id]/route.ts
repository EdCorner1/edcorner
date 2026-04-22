import { NextResponse } from 'next/server'
import { getSiteConfig } from '@/lib/supabase'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    const allowed = ['hero', 'profile', 'brands', 'metrics', 'videos']
    if (!allowed.includes(id)) {
      return NextResponse.json({}, { status: 404 })
    }

    const value = await getSiteConfig(id as 'hero' | 'profile' | 'brands' | 'metrics' | 'videos')
    return NextResponse.json(value ?? {})
  } catch {
    return NextResponse.json({}, { status: 500 })
  }
}