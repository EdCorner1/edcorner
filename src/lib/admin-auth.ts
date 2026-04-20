import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const ADMIN_COOKIE = 'edcorner-admin-auth'
const ADMIN_COOKIE_VALUE = 'ok'

export async function hasAdminSession() {
  const cookieStore = await cookies()
  return cookieStore.get(ADMIN_COOKIE)?.value === ADMIN_COOKIE_VALUE
}

export async function requireAdminPageAuth() {
  if (!(await hasAdminSession())) {
    redirect('/login')
  }
}
