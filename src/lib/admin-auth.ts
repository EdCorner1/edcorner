import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const ADMIN_COOKIE = 'edcorner-admin-auth'
const ADMIN_COOKIE_VALUE = 'ok'

export async function hasAdminSession(): Promise<boolean> {
  try {
    const cookieStore = await cookies()
    return cookieStore.get(ADMIN_COOKIE)?.value === ADMIN_COOKIE_VALUE
  } catch {
    return false
  }
}

export async function requireAdminPageAuth() {
  const authenticated = await hasAdminSession()
  if (!authenticated) {
    redirect('/login')
  }
}