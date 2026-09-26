'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth/client'
import Link from 'next/link'
import {
  AuthShell,
  FormField,
  FormAlert,
  SubmitButton,
} from '@/components/auth/auth-shell'

export default function SignInPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setIsPending(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    try {
      const result = await authClient.signIn.email({ email, password })

      if (result && 'error' in result && result.error) {
        setError('Email atau password salah')
        setIsPending(false)
        return
      }

      const res = await fetch('/api/me')
      const json = await res.json()

      if (json.ok && json.dbUser) {
        const role = json.dbUser.role
        if (role === 'admin') router.push('/admin/dashboard')
        else if (role === 'student') router.push('/student/dashboard')
        else if (role === 'company') router.push('/company/dashboard')
        else if (role === 'school') router.push('/school/dashboard')
        else if (role === 'certification') router.push('/certification/dashboard')
        else router.push('/')
      } else {
        router.push('/onboarding')
      }

      router.refresh()
    } catch (err: any) {
      setError(err?.message || 'Gagal masuk. Coba lagi.')
      setIsPending(false)
    }
  }

  return (
    <AuthShell
      side="sign-in"
      title="Masuk ke VocAZ"
      subtitle="Gunakan akun yang sudah kamu daftarkan"
      footer={
        <>
          Belum punya akun?{' '}
          <Link
            href="/auth/sign-up"
            className="text-primary font-semibold hover:underline"
          >
            Daftar sekarang
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && <FormAlert>{error}</FormAlert>}

        <FormField
          id="email"
          label="Email"
          type="email"
          placeholder="email@example.com"
          required
          autoComplete="email"
        />

        <FormField
          id="password"
          label="Password"
          type="password"
          placeholder="Password kamu"
          required
          autoComplete="current-password"
        />

        <div className="flex items-center justify-end">
          <Link
            href="/auth/forgot-password"
            className="text-xs font-semibold text-primary hover:underline"
          >
            Lupa password?
          </Link>
        </div>

        <SubmitButton
          isPending={isPending}
          label="Masuk"
          loadingLabel="Memproses..."
        />
      </form>
    </AuthShell>
  )
}