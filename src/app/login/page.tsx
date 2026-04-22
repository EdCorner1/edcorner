import AdminLoginForm from '@/components/admin/admin-login-form'

export const dynamic = 'force-dynamic'

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string }>
}) {
  let error: string | null = null
  try {
    const params = await searchParams
    error = typeof params?.error === 'string' ? params.error : null
  } catch {
    // searchParams might not be available in some edge cases
  }

  return (
    <section className="admin-auth-layout">
      <div className="admin-auth-backdrop" />
      <AdminLoginForm error={error} />
    </section>
  )
}