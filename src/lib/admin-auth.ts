import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const ADMIN_COOKIE = 'edcorner-admin-auth'
const ADMIN_COOKIE_VALUE = 'ok'

export async function isAdminAuthenticated() {
  const cookieStore = await cookies()
  return cookieStore.get(ADMIN_COOKIE)?.value === ADMIN_COOKIE_VALUE
}

export async function requireAdminAuth() {
  if (!(await isAdminAuthenticated())) {
    redirect('/login')
  }
}

export async function createAdminSession() {
  const cookieStore = await cookies()
  cookieStore.set(ADMIN_COOKIE, ADMIN_COOKIE_VALUE, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })
}

export async function clearAdminSession() {
  const cookieStore = await cookies()
  cookieStore.set(ADMIN_COOKIE, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires: new Date(0),
  })
}
