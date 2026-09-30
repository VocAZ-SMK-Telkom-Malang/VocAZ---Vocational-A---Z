// app/register/school/_components/step-5-done.tsx
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
  Sparkles,
} from 'lucide-react'
import { RegisterShell } from '@/components/register/register-shell'
import { REGISTER_STEPS } from '@/lib/register/steps'
import { authClient } from '@/lib/auth/client'
import { finalizeSchoolRegistration } from '@/lib/register/actions/school'

type Status = 'loading' | 'success' | 'error' | 'already-registered'

export function Step5Done() {
  const router = useRouter()
  const [status, setStatus] = useState<Status>('loading')
  const [error, setError] = useState<string | null>(null)
  const [schoolCode, setSchoolCode] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function process() {
      try {
        const raw = sessionStorage.getItem('school-register')

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
          !data.schoolName ||
          !data.plan ||
          !data.paymentMethod
        ) {
          if (!cancelled) {
            setError('Data registrasi tidak lengkap. Silakan ulangi.')
            setStatus('error')
          }
          return
        }

        // 1. Sign-up Neon Auth
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
        const finalizeResult = await finalizeSchoolRegistration({
          neonAuthUserId: session.user.id,
          plan: data.plan,
          planPrice: data.planPrice,
          paymentMethod: data.paymentMethod,
          paymentReference: data.paymentReference || '',
          email: data.email,
          password: data.password,
          fullName: data.fullName,
          position: data.position,
          schoolName: data.schoolName,
          npsn: data.npsn,
          level: 'smk',
          accreditation: data.accreditation,
          address: data.address,
          city: data.city,
          province: data.province,
          bkkName: data.bkkName,
          bkkContact: data.bkkContact,
          bkkEmail: data.bkkEmail,
          bkkPhone: data.bkkPhone,
        })

        if (!finalizeResult.ok) {
          if (!cancelled) {
            setError(finalizeResult.error || 'Gagal menyimpan data')
            setStatus('error')
          }
          return
        }

        // 4. Clear sessionStorage
        sessionStorage.removeItem('school-register')

        if (!cancelled) {
          setSchoolCode(finalizeResult.data?.schoolCode || null)
          setStatus('success')
        }

        // 5. Redirect
        setTimeout(() => {
          if (!cancelled) {
            router.push('/school/dashboard')
            router.refresh()
          }
        }, 4000)
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
      role="school"
      steps={REGISTER_STEPS.school}
      currentStep={5}
      title={
        status === 'success'
          ? 'Selamat Datang di VocAZ BKK!'
          : status === 'error'
            ? 'Terjadi Kesalahan'
            : status === 'already-registered'
              ? 'Email Sudah Terdaftar'
              : 'Memproses Pendaftaran...'
      }
      description={
        status === 'success'
          ? 'Akun BKK sekolah berhasil dibuat. Mengalihkan ke dashboard...'
          : status === 'loading'
            ? 'Mohon tunggu, kami sedang menyiapkan akun sekolah Anda.'
            : undefined
      }
      backHref="/"
    >
      {status === 'loading' && (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
          <p className="text-sm text-on-surface-variant">
            Membuat akun &amp; menyimpan data sekolah...
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

          {/* School Code card */}
          {schoolCode && (
            <div className="rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 p-5 text-center">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary font-mono text-[10px] font-bold uppercase tracking-wider mb-3">
                <Sparkles className="w-3 h-3" />
                Kode Sekolah Anda
              </div>
              <div className="font-mono text-2xl font-extrabold text-on-surface tracking-wider mb-2">
                {schoolCode}
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Bagikan kode ini ke siswa Anda untuk mendaftar di VocAZ.
              </p>
            </div>
          )}

          <div className="rounded-xl border border-outline-variant/30 bg-surface-container-low p-5">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <span className="text-sm">🎯</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-on-surface mb-1">
                  Langkah Selanjutnya
                </p>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Lengkapi profil sekolah, undang admin BKK, dan mulai
                  mengaktifkan akun siswa dengan kode sekolah.
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
              href="/school/dashboard"
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
              href="/register/school/1"
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