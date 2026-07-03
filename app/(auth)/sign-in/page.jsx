'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSupabase } from '@lib/supabase/SupabaseProvider'
import AuthShell from '@components/auth/AuthShell'
import FormField from '@components/ui/FormField'
import Button from '@components/ui/Button'

export default function SignInPage() {
  const { supabase } = useSupabase()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      setSubmitting(false)
      return
    }
    router.push('/')
    router.refresh()
  }

  return (
    <AuthShell title={<>Welcome<br />back.</>} subtitle="Log in to your campus.">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <FormField
          label="Email"
          type="email"
          placeholder="you@college.edu"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
        <FormField
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />
        {error && <p className="text-danger text-sm font-semibold">{error}</p>}
        <Button type="submit" disabled={submitting} className="w-full mt-1">
          {submitting ? 'Logging in…' : 'Log in'}
        </Button>
      </form>
      <p className="text-center text-ink-3 text-sm mt-6">
        New here?{' '}
        <Link href="/sign-up" className="text-[#FF4DA0] font-extrabold">
          Sign up
        </Link>
      </p>
    </AuthShell>
  )
}
