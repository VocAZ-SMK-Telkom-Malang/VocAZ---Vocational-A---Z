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

export default function SignUpPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setIsPending(true)

    const formData = new FormData(e.currentTarget)
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    try {
      const result = await authClient.signUp.email({ name, email, password })

      if (result && 'error' in result && result.error) {
        const errMsg = (result.error as any)?.message || ''

        if (errMsg.toLowerCase().includes('already exists')) {
          setError('Email sudah terdaftar. Gunakan email lain atau masuk.')
        } else {
          setError(errMsg || 'Gagal mendaftar')
        }
        setIsPending(false)
        return
      }

      router.push('/onboarding')
      router.refresh()
    } catch (err: any) {
      const errMsg = err?.message || String(err)

      if (errMsg.toLowerCase().includes('already exists')) {
        setError('Email sudah terdaftar. Gunakan email lain atau masuk.')
      } else {
        setError(errMsg || 'Terjadi kesalahan saat mendaftar')
      }
      setIsPending(false)
    }
  }

  return (
    <AuthShell
      side="sign-up"
      title="Daftar VocAZ"
      subtitle="Buat akun untuk mulai membangun karier"
      footer={
        <>
          Sudah punya akun?{' '}
          <Link
            href="/auth/sign-in"
            className="text-primary font-semibold hover:underline"
          >
            Masuk di sini
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && <FormAlert>{error}</FormAlert>}

        <FormField
          id="name"
          label="Nama Lengkap"
          placeholder="Nama kamu"
          required
          autoComplete="name"
        />

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
          placeholder="Minimal 8 karakter"
          required
          minLength={8}
          autoComplete="new-password"
        />

        <p className="text-xs text-on-surface-variant leading-relaxed">
          Dengan mendaftar, kamu menyetujui{' '}
          <Link href="#" className="text-primary hover:underline font-medium">
            Syarat & Ketentuan
          </Link>{' '}
          dan{' '}
          <Link href="#" className="text-primary hover:underline font-medium">
            Kebijakan Privasi
          </Link>{' '}
          VocAZ.
        </p>

        <SubmitButton
          isPending={isPending}
          label="Daftar"
          loadingLabel="Membuat akun..."
        />
      </form>
    </AuthShell>
  )
}