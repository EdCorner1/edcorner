import AdminLoginForm from '@/components/admin/admin-login-form'

type LoginPageProps = {
  searchParams?: Promise<{
    error?: string
  }>
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = (await searchParams) ?? {}
  const error = typeof params.error === 'string' ? params.error : null

  return (
    <section className="admin-auth-layout">
      <div className="admin-auth-backdrop" />
      <AdminLoginForm error={error} />
    </section>
  )
}
// v2
