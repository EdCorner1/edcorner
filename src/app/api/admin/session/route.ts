import { NextResponse } from 'next/server'
import { clearAdminSession, createAdminSession } from '@/lib/admin-auth'

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const email = body?.email

  if (!email || typeof email !== 'string') {
    return NextResponse.json({ error: 'Missing email.' }, { status: 400 })
  }

  await createAdminSession()

  return NextResponse.json({ ok: true })
}

export async function DELETE() {
  await clearAdminSession()
  return NextResponse.json({ ok: true })
}
