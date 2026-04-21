type AdminLoginFormProps = {
  redirectTo?: string
  error?: string | null
}

export default function AdminLoginForm({ redirectTo = '/admin', error }: AdminLoginFormProps) {
  return (
    <form className="admin-auth-card admin-auth-form" method="post" action="/api/admin/session">
      <input type="hidden" name="redirectTo" value={redirectTo} />

      <div className="admin-auth-copy">
        <span className="admin-eyebrow">Private admin</span>
        <h1>Sign in to manage videos</h1>
        <p>
          Use your Supabase email + password. This route is intentionally hidden from the public site.
        </p>
      </div>

      <label className="admin-field">
        <span>Email</span>
        <input
          autoComplete="email"
          inputMode="email"
          placeholder="you@edcorner.co.uk"
          type="email"
          name="email"
          required
        />
      </label>

      <label className="admin-field">
        <span>Password</span>
        <input
          autoComplete="current-password"
          placeholder="••••••••"
          type="password"
          name="password"
          required
        />
      </label>

      {error ? <p className="admin-form-error">{error}</p> : null}

      <button className="admin-primary-btn" type="submit">
        Open admin
      </button>
    </form>
  )
}
