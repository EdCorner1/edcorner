import { redirect } from 'next/navigation'
import AdminLoginForm from '@/components/admin/admin-login-form'
import { isAdminAuthenticated } from '@/lib/admin-auth'

export default async function LoginPage() {
  if (await isAdminAuthenticated()) {
    redirect('/admin')
  }

  return (
    <section className="admin-auth-layout">
      <div className="admin-auth-backdrop" />
      <AdminLoginForm />
    </section>
  )
}
