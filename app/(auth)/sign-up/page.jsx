'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSupabase } from '@lib/supabase/SupabaseProvider'
import AuthShell from '@components/auth/AuthShell'
import FormField from '@components/ui/FormField'
import Button from '@components/ui/Button'

export default function SignUpPage() {
  const { supabase } = useSupabase()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError("Passwords don't match")
      return
    }

    setSubmitting(true)
    const { error } = await supabase.auth.signUp({ email, password })
    setSubmitting(false)
    if (error) {
      setError(error.message)
      return
    }
    setSent(true)
  }

  if (sent) {
    return (
      <AuthShell eyebrow="Almost there" title="Check your inbox.">
        <p className="text-ink-2 text-sm leading-relaxed">
          We sent a confirmation link to <span className="text-white font-bold">{email}</span>.
          Verify your email, then log in to complete your profile and join your campus.
        </p>
        <Link href="/sign-in" className="block mt-6">
          <Button className="w-full">Back to log in</Button>
        </Link>
      </AuthShell>
    )
  }

  return (
    <AuthShell title={<>Join your<br />campus.</>} subtitle="Create your account to get started.">
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
          autoComplete="new-password"
        />
        <FormField
          label="Confirm password"
          type="password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          autoComplete="new-password"
        />
        {error && <p className="text-danger text-sm font-semibold">{error}</p>}
        <Button type="submit" disabled={submitting} className="w-full mt-1">
          {submitting ? 'Creating account…' : 'Continue'}
        </Button>
      </form>
      <p className="text-center text-ink-3 text-sm mt-6">
        Already have an account?{' '}
        <Link href="/sign-in" className="text-[#FF4DA0] font-extrabold">
          Log in
        </Link>
      </p>
    </AuthShell>
  )
}
