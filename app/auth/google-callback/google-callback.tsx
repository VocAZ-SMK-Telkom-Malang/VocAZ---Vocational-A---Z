'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { GoogleAuthButton } from '@/components/auth/google-auth-button'
import { authClient } from '@/lib/auth/client'

const REGISTRATION_PATHS = new Set([
  '/register/student/1',
  '/register/company/1',
  '/register/school/3',
  '/register/certification/2',
])

// Helper: tunggu
function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// Helper: coba get session dengan retry
async function getSessionWithRetry(maxAttempts = 5, delayMs = 500) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const result = await authClient.getSession()

      if (
        !result.error &&
        result.data?.user?.id &&
        result.data?.user?.email
      ) {
        return result
      }

      // Kalau masih kosong & bukan attempt terakhir → tunggu
      if (attempt < maxAttempts) {
        console.log(
          `[google-auth] Session belum siap, retry ${attempt}/${maxAttempts}...`
        )
        await sleep(delayMs)
      } else {
        return result
      }
    } catch (err) {
      if (attempt < maxAttempts) {
        await sleep(delayMs)
      } else {
        throw err
      }
    }
  }
  return null
}

export function GoogleCallback({ requestedPath }: { requestedPath?: string }) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [retrying, setRetrying] = useState(false)
  const [status, setStatus] = useState('Menghubungkan akun Google ke VocAZ...')

  useEffect(() => {
    let cancelled = false

    async function finishGoogleSignIn() {
      try {
        // ============================================
        // 1. Retry getSession (5x, delay 500ms)
        // ============================================
        setStatus('Memverifikasi sesi Google...')
        const sessionResult = await getSessionWithRetry(5, 500)

        if (cancelled) return

        if (!sessionResult || sessionResult.error) {
          throw new Error(
            sessionResult?.error?.message ||
              'Sesi Google tidak ditemukan. Silakan coba lagi.'
          )
        }

        const session = sessionResult.data
        if (!session?.user?.id || !session?.user?.email) {
          throw new Error('Sesi Google tidak valid. Silakan coba lagi.')
        }

        // ============================================
        // 2. Cek user di DB VocAZ
        // ============================================
        setStatus('Memeriksa akun VocAZ...')
        const meResponse = await fetch('/api/me', {
          cache: 'no-store',
          credentials: 'include',
        })

        if (!meResponse.ok) {
          throw new Error('Gagal memeriksa akun VocAZ.')
        }

        const me = await meResponse.json()

        if (cancelled) return

        // ============================================
        // 3. Redirect
        // ============================================
        if (me.ok && me.dbUser?.role) {
          const routes: Record<string, string> = {
            admin: '/admin/dashboard',
            student: '/student/dashboard',
            company: '/company/dashboard',
            school: '/school/dashboard',
            certification: '/certification/dashboard',
          }
          router.replace(routes[me.dbUser.role] || '/')
        } else if (requestedPath === '/join') {
          sessionStorage.setItem('vocaz.google-oauth-pending', 'true')
          router.replace('/join')
        } else if (
          requestedPath &&
          REGISTRATION_PATHS.has(requestedPath.split('?')[0])
        ) {
          sessionStorage.setItem('vocaz.google-oauth-pending', 'true')
          const [path, query = ''] = requestedPath.split('?')
          const params = new URLSearchParams(query)
          params.set('oauth', 'google')
          router.replace(`${path}?${params.toString()}`)
        } else {
          sessionStorage.setItem('vocaz.google-oauth-pending', 'true')
          router.replace('/join')
        }

        router.refresh()
      } catch (cause) {
        console.error('[google-auth] Callback Google gagal:', cause)
        if (!cancelled) {
          setError(
            cause instanceof Error
              ? cause.message
              : 'Gagal menyelesaikan masuk dengan Google.'
          )
        }
      }
    }

    void finishGoogleSignIn()
    return () => {
      cancelled = true
    }
  }, [requestedPath, router, retrying])

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-surface px-4">
        <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-xl ring-1 ring-outline-variant/30">
          <h1 className="font-display text-xl font-bold text-on-surface">
            Gagal masuk dengan Google
          </h1>
          <p role="alert" className="mt-3 text-sm text-red-600">
            {error}
          </p>
          <div className="mt-6">
            <GoogleAuthButton
              callbackURL={`/auth/google-callback?next=${encodeURIComponent(
                requestedPath || ''
              )}`}
              label="Coba lagi dengan Google"
            />
          </div>
          <button
            type="button"
            onClick={() => {
              setError(null)
              setRetrying((value) => !value)
            }}
            className="mt-4 text-sm font-semibold text-primary hover:underline"
          >
            Periksa sesi lagi
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-4 bg-surface px-4">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
      <p className="text-sm font-semibold text-on-surface">{status}</p>
      <p className="text-xs text-on-surface-variant max-w-xs text-center">
        Mohon tunggu, sedang memverifikasi akun Google kamu...
      </p>
    </main>
  )
}