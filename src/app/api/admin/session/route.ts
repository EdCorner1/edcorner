import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const ADMIN_COOKIE = 'edcorner-admin-auth'
const ADMIN_COOKIE_VALUE = 'ok'

function createAuthClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in environment.')
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

function wantsJson(request: Request) {
  const contentType = request.headers.get('content-type') ?? ''
  const accept = request.headers.get('accept') ?? ''
  return contentType.includes('application/json') || accept.includes('application/json')
}

async function readCredentials(request: Request) {
  const contentType = request.headers.get('content-type') ?? ''

  if (contentType.includes('application/json')) {
    const body = await request.json().catch(() => null)
    return {
      email: typeof body?.email === 'string' ? body.email.trim() : '',
      password: typeof body?.password === 'string' ? body.password : '',
      redirectTo: typeof body?.redirectTo === 'string' ? body.redirectTo : '',
    }
  }

  const formData = await request.formData().catch(() => null)
  return {
    email: typeof formData?.get('email') === 'string' ? String(formData.get('email')).trim() : '',
    password: typeof formData?.get('password') === 'string' ? String(formData.get('password')) : '',
    redirectTo: typeof formData?.get('redirectTo') === 'string' ? String(formData.get('redirectTo')) : '',
  }
}

function normalizeRedirectTo(redirectTo: string) {
  return redirectTo && redirectTo.startsWith('/') ? redirectTo : '/admin'
}

function buildErrorResponse(request: Request, message: string, status = 400) {
  if (wantsJson(request)) {
    return NextResponse.json({ error: message }, { status })
  }

  const loginUrl = new URL('/login', request.url)
  loginUrl.searchParams.set('error', message)
  return NextResponse.redirect(loginUrl, { status: 303 })
}

export async function POST(request: Request) {
  try {
    const { email, password, redirectTo } = await readCredentials(request)

    if (!email || !password) {
      return buildErrorResponse(request, 'Email and password are required.', 400)
    }

    const supabase = createAuthClient()
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error || !data.user) {
      return buildErrorResponse(request, error?.message ?? 'Could not sign you in.', 401)
    }

    const response = wantsJson(request)
      ? NextResponse.json({ ok: true })
      : NextResponse.redirect(new URL(normalizeRedirectTo(redirectTo), request.url), { status: 303 })

    response.cookies.set(ADMIN_COOKIE, ADMIN_COOKIE_VALUE, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })

    return response
  } catch (error) {
    return buildErrorResponse(
      request,
      error instanceof Error ? error.message : 'Unexpected authentication error.',
      500
    )
  }
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true })
  response.cookies.set(ADMIN_COOKIE, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires: new Date(0),
  })
  return response
}
