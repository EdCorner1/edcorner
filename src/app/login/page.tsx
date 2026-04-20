import AdminLoginForm from '@/components/admin/admin-login-form'

export default function LoginPage() {
  return (
    <section className="admin-auth-layout">
      <div className="admin-auth-backdrop" />
      <AdminLoginForm />
    </section>
  )
}
