// app/register/certification/_components/step-4-done.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  CheckCircle2,
  ArrowRight,
  Loader2,
  AlertCircle,
  RefreshCw,
  ShieldCheck,
} from 'lucide-react'
import { RegisterShell } from '@/components/register/register-shell'
import { REGISTER_STEPS } from '@/lib/register/steps'
import { authClient } from '@/lib/auth/client'
import { finalizeCertificationRegistration } from '@/lib/register/actions/certification'

type Status = 'loading' | 'success' | 'error' | 'already-registered'

export function Step4Done() {
  const router = useRouter()
  const [status, setStatus] = useState<Status>('loading')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function process() {
      try {
        const raw = sessionStorage.getItem('certification-register')

        if (!raw) {
          if (!cancelled) {
            setError('Data registrasi tidak ditemukan. Silakan ulangi.')
            setStatus('error')
          }
          return
        }

        const data = JSON.parse(raw)

        if (
          !data.email ||
          !data.password ||
          !data.fullName ||
          !data.institutionName ||
          !data.type
        ) {
          if (!cancelled) {
            setError('Data registrasi tidak lengkap. Silakan ulangi.')
            setStatus('error')
          }
          return
        }

        // 1. Sign-up ke Neon Auth
        const signUpResult = await authClient.signUp.email({
          email: data.email,
          password: data.password,
          name: data.fullName,
        })

        if (signUpResult && 'error' in signUpResult && signUpResult.error) {
          const errMsg = (signUpResult.error as any)?.message || ''

          if (errMsg.toLowerCase().includes('already exists')) {
            if (!cancelled) {
              setError(
                'Email sudah terdaftar. Coba masuk atau gunakan email lain.'
              )
              setStatus('already-registered')
            }
            return
          }

          if (!cancelled) {
            setError(errMsg || 'Gagal membuat akun auth')
            setStatus('error')
          }
          return
        }

        // 2. Ambil session
        const sessionRes = await fetch('/api/auth/get-session')
        const session = await sessionRes.json()

        if (!session?.user?.id) {
          if (!cancelled) {
            setError('Gagal mendapatkan session. Coba lagi.')
            setStatus('error')
          }
          return
        }

        // 3. Finalize
        const finalizeResult = await finalizeCertificationRegistration({
          neonAuthUserId: session.user.id,
          type: data.type,
          email: data.email,
          password: data.password,
          fullName: data.fullName,
          position: data.position,
          institutionName: data.institutionName,
          licenseNumber: data.licenseNumber,
          emailInstitution: data.emailInstitution,
          phone: data.phone,
          website: data.website,
          address: data.address,
          description: data.description,
        })

        if (!finalizeResult.ok) {
          if (!cancelled) {
            setError(finalizeResult.error || 'Gagal menyimpan data')
            setStatus('error')
          }
          return
        }

        // 4. Clear sessionStorage
        sessionStorage.removeItem('certification-register')

        if (!cancelled) {
          setStatus('success')
        }

        // 5. Redirect
        setTimeout(() => {
          if (!cancelled) {
            router.push('/certification/dashboard')
            router.refresh()
          }
        }, 3000)
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Terjadi kesalahan')
          setStatus('error')
        }
      }
    }

    process()

    return () => {
      cancelled = true
    }
  }, [router])

  return (
    <RegisterShell
      role="certification"
      steps={REGISTER_STEPS.certification}
      currentStep={4}
      title={
        status === 'success'
          ? 'Pendaftaran Berhasil!'
          : status === 'error'
            ? 'Terjadi Kesalahan'
            : status === 'already-registered'
              ? 'Email Sudah Terdaftar'
              : 'Memproses Pendaftaran...'
      }
      description={
        status === 'success'
          ? 'Akun lembaga sertifikasi berhasil dibuat. Mengalihkan ke dashboard...'
          : status === 'loading'
            ? 'Mohon tunggu, kami sedang menyiapkan akun Anda.'
            : undefined
      }
      backHref="/"
    >
      {status === 'loading' && (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
          <p className="text-sm text-on-surface-variant">
            Membuat akun &amp; menyimpan data lembaga...
          </p>
          <p className="text-xs text-on-surface-variant mt-1">
            Jangan tutup halaman ini
          </p>
        </div>
      )}

      {status === 'success' && (
        <div className="space-y-6">
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center">
              <CheckCircle2
                className="w-10 h-10 text-emerald-600"
                strokeWidth={2.5}
              />
            </div>
          </div>

          <div className="rounded-xl border border-outline-variant/30 bg-surface-container-low p-5">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-on-surface mb-1">
                  Langkah Selanjutnya
                </p>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Lengkapi profil lembaga, dan mulai verifikasi sertifikat dari
                  siswa SMK. Lembaga Anda akan muncul di daftar mitra resmi
                  VocAZ.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 text-xs text-on-surface-variant">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>Mengalihkan ke dashboard...</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              href="/certification/dashboard"
              className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary-container to-[#E03E3E] text-white font-display text-sm font-semibold px-6 py-3 rounded-full shadow-[0_8px_20px_rgba(220,38,38,0.25)] hover:brightness-105 transition-all"
            >
              <span>Menuju Dashboard Sekarang</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      {(status === 'error' || status === 'already-registered') && (
        <div className="space-y-6">
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
              <AlertCircle
                className="w-10 h-10 text-red-600"
                strokeWidth={2.5}
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/register/certification/1"
              className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary-container to-[#E03E3E] text-white font-display text-sm font-semibold px-6 py-3 rounded-full shadow-[0_8px_20px_rgba(220,38,38,0.25)] hover:brightness-105 transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Coba Lagi</span>
            </Link>
            <Link
              href="/auth/sign-in"
              className="flex-1 inline-flex items-center justify-center px-6 py-3 rounded-full ring-1 ring-outline-variant text-sm font-semibold text-on-surface hover:bg-surface-container-low transition-colors"
            >
              Ke Halaman Masuk
            </Link>
          </div>
        </div>
      )}
    </RegisterShell>
  )
}