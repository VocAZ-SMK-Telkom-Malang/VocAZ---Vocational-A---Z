'use client'

import { useEffect, useState } from 'react'
import { authClient } from '@/lib/auth/client'

export type GoogleRegistrationAccount = {
  email: string
  fullName: string
}

export function useGoogleRegistration() {
  const [account, setAccount] = useState<GoogleRegistrationAccount | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const isGoogleRegistration =
      sessionStorage.getItem('vocaz.google-oauth-pending') === 'true' ||
      new URLSearchParams(window.location.search).get('oauth') === 'google'
    if (!isGoogleRegistration) return

    let cancelled = false

    async function loadGoogleAccount() {
      try {
        const sessionResult = await authClient.getSession()
        if (sessionResult.error) {
          throw new Error(
            sessionResult.error.message || 'Sesi Google tidak dapat diverifikasi.'
          )
        }
        const session = sessionResult.data

        if (!session?.user?.id) return
        if (!session.user?.email) {
          throw new Error('Email akun Google tidak ditemukan. Coba masuk lagi.')
        }

        if (!cancelled) {
          setAccount({
            email: session.user.email,
            fullName: session.user.name || '',
          })
        }
      } catch (cause) {
        console.error('[google-auth] Gagal memuat akun Google:', cause)
        if (!cancelled) {
          setError(
            cause instanceof Error
              ? cause.message
              : 'Gagal memuat akun Google. Coba lagi.'
          )
        }
      }
    }

    void loadGoogleAccount()
    return () => {
      cancelled = true
    }
  }, [])

  return { account, error }
}
