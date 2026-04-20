'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

type AdminLoginFormProps = {
  redirectTo?: string
}

export default function AdminLoginForm({ redirectTo = '/admin' }: AdminLoginFormProps) {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError || !data.user) {
      setError(signInError?.message ?? 'Could not sign you in.')
      return
    }

    const response = await fetch('/api/admin/session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: data.user.email,
      }),
    })

    if (!response.ok) {
      const payload = await response.json().catch(() => null)
      setError(payload?.error ?? 'Signed in, but could not open admin session.')
      return
    }

    startTransition(() => {
      router.replace(redirectTo)
      router.refresh()
    })
  }

  return (
    <form className="admin-auth-card admin-auth-form" onSubmit={handleSubmit}>
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
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
      </label>

      <label className="admin-field">
        <span>Password</span>
        <input
          autoComplete="current-password"
          placeholder="••••••••"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
      </label>

      {error ? <p className="admin-form-error">{error}</p> : null}

      <button className="admin-primary-btn" type="submit" disabled={isPending}>
        {isPending ? 'Opening dashboard…' : 'Open admin'}
      </button>
    </form>
  )
}
