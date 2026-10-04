// app/register/company/_components/step-4-done.tsx
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
} from 'lucide-react'
import { RegisterShell } from '@/components/register/register-shell'
import { REGISTER_STEPS } from '@/lib/register/steps'
import { authClient } from '@/lib/auth/client'
import { finalizeCompanyRegistration } from '@/lib/register/actions/company'
import { clearRegistrationId } from '@/lib/storage/upload-client'

type Status = 'loading' | 'success' | 'error' | 'already-registered'

export function Step4Done() {
  const router = useRouter()
  const [status, setStatus] = useState<Status>('loading')
  const [error, setError] = useState<string | null>(null)
  const [companySlug, setCompanySlug] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function process() {
      try {
        const raw = sessionStorage.getItem('company-register')

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
          (!data.googleAuth && !data.password) ||
          !data.fullName ||
          !data.companyName
        ) {
          if (!cancelled) {
            setError('Data registrasi tidak lengkap. Silakan ulangi.')
            setStatus('error')
          }
          return
        }

        if (!data.googleAuth) {
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
        }

        // 2. Ambil session — untuk dapat neonAuthUserId
        const sessionResult = await authClient.getSession()
        const session = sessionResult.data

        if (!session?.user?.id) {
          if (!cancelled) {
            setError('Gagal mendapatkan session. Coba lagi.')
            setStatus('error')
          }
          return
        }

        // 3. Finalize di DB
        const finalizeResult = await finalizeCompanyRegistration({
          neonAuthUserId: session.user.id,
          email: data.email,
          password: data.password,
          fullName: data.fullName,
          position: data.position || 'other',
          companyName: data.companyName,
          industry: data.industry || 'Other',
          companySize: data.companySize || 's1_10',
          foundedYear: data.foundedYear,
          website: data.website,
          phone: data.phone,
          address: data.address,
          city: data.city,
          province: data.province,
          description: data.description,
          logoUrl: data.logoUrl,
          logoKey: data.logoKey,
          businessRegistrationNumber: data.businessRegistrationNumber,
          documents: data.documents,
          skippedDocs: data.skippedDocs,
          responsibleName: data.responsibleName,
          responsiblePosition: data.responsiblePosition,
          responsibleEmail: data.responsibleEmail,
        })

        if (!finalizeResult.ok) {
          if (!cancelled) {
            setError(finalizeResult.error || 'Gagal menyimpan data')
            setStatus('error')
          }
          return
        }

        // 4. Clear sessionStorage
        sessionStorage.removeItem('company-register')
        sessionStorage.removeItem('vocaz.google-oauth-pending')
        clearRegistrationId() // ← clear registrationId juga

        if (!cancelled) {
          setCompanySlug(finalizeResult.data?.companySlug || null)
          setStatus('success')
        }

        // 5. Redirect setelah 3 detik
        setTimeout(() => {
          if (!cancelled) {
            router.push('/company/dashboard')
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
      role="company"
      steps={REGISTER_STEPS.company}
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
          ? 'Akun perusahaan Anda berhasil dibuat. Mengarahkan ke dashboard...'
          : status === 'loading'
            ? 'Mohon tunggu, kami sedang memproses data Anda.'
            : undefined
      }
      backHref="/"
    >
      {status === 'loading' && (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
          <p className="text-sm text-on-surface-variant">
            Membuat akun & menyimpan data...
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

          <div className="rounded-xl border border-outline-variant/30 bg-surface-container-low p-5 space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <span className="text-sm">⏳</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-on-surface mb-1">
                  Under Review
                </p>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Tim verifikasi kami akan meninjau informasi perusahaan Anda
                  dalam 1-2 hari kerja.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-display text-sm font-bold text-on-surface mb-3">
              Apa langkah selanjutnya?
            </h3>
            <ul className="space-y-2.5 text-xs text-on-surface-variant">
              <li className="flex items-start gap-2">
                <span className="font-mono text-[10px] font-bold bg-primary/10 text-primary px-1.5 py-0.5 rounded shrink-0 mt-0.5">
                  01
                </span>
                <span>
                  <strong className="text-on-surface">Review</strong> — Tim
                  VocAZ meninjau informasi perusahaan Anda
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-mono text-[10px] font-bold bg-primary/10 text-primary px-1.5 py-0.5 rounded shrink-0 mt-0.5">
                  02
                </span>
                <span>
                  <strong className="text-on-surface">Verification</strong> —
                  Verifikasi dilakukan oleh tim resmi VocAZ
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-mono text-[10px] font-bold bg-primary/10 text-primary px-1.5 py-0.5 rounded shrink-0 mt-0.5">
                  03
                </span>
                <span>
                  <strong className="text-on-surface">Start Recruiting</strong>{' '}
                  — Anda bisa mulai posting lowongan
                </span>
              </li>
            </ul>
          </div>

          <div className="flex items-center justify-center gap-2 text-xs text-on-surface-variant">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>Mengarahkan ke dashboard...</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              href="/company/dashboard"
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
              href="/register/company/1"
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