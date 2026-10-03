// app/auth/sign-in/_components/sign-in-form.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { authClient } from '@/lib/auth/client'
import {
  AuthShell,
  FormField,
  FormAlert,
  SubmitButton,
} from '@/components/auth/auth-shell'
import { getDashboardPath } from '@/lib/auth/redirects'

export function SignInForm() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setIsPending(true)

    const formData = new FormData(e.currentTarget)
    const email = (formData.get('email') as string).trim().toLowerCase()
    const password = formData.get('password') as string

    try {
      const result = await authClient.signIn.email({ email, password })

      // Neon Auth: kalau ada error di result
      if (result && 'error' in result && (result as any).error) {
        const errObj = (result as any).error
        setError(
          typeof errObj === 'string'
            ? errObj
            : errObj?.message || 'Email atau password salah'
        )
        setIsPending(false)
        return
      }

      // Ambil role dari /api/me
      const res = await fetch('/api/me', { cache: 'no-store' })
      const json = await res.json()

      if (json.ok && json.dbUser?.role) {
        router.replace(getDashboardPath(json.dbUser.role))
        router.refresh()
        return
      }

      // Jika user belum memiliki role terdaftar -> arahkan ke /join
      router.replace('/join')
      router.refresh()
    } catch (err: unknown) {
      console.error('[sign-in] error:', err)
      setError(
        err instanceof Error
          ? err.message
          : 'Gagal masuk. Coba lagi sebentar lagi.'
      )
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
            href="/join"
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
