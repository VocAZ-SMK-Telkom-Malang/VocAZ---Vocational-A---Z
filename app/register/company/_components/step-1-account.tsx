'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { RegisterShell } from '@/components/register/register-shell'
import { StepNav } from '@/components/register/step-nav'
import { REGISTER_STEPS } from '@/lib/register/steps'
import { Info } from 'lucide-react'
import { GoogleAuthButton } from '@/components/auth/google-auth-button'
import { useGoogleRegistration } from '@/components/auth/use-google-registration'

export function Step1Account() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)
  const { account: googleAccount, error: googleError } = useGoogleRegistration()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setIsPending(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string
    const fullName = formData.get('fullName') as string
    const position = formData.get('position') as string

    // Validasi
    if (!googleAccount && password !== confirmPassword) {
      setError('Password dan konfirmasi password tidak cocok')
      setIsPending(false)
      return
    }

    if (!googleAccount && password.length < 8) {
      setError('Password minimal 8 karakter')
      setIsPending(false)
      return
    }

    // Simpan ke sessionStorage dulu — nanti dikirim di step terakhir
    sessionStorage.setItem(
      'company-register',
      JSON.stringify({
        email: googleAccount?.email || email,
        password: googleAccount ? undefined : password,
        fullName: fullName || googleAccount?.fullName,
        position,
        googleAuth: Boolean(googleAccount),
      })
    )

    // Lanjut ke step 2
    router.push('/register/company/2')
    setIsPending(false)
  }

  return (
    <RegisterShell
      role="company"
      steps={REGISTER_STEPS.company}
      currentStep={1}
      title="Buat Akun Perusahaan Anda"
      description="Mulai bangun profil perusahaan Anda dan temukan talenta yang tepat di VocAZ."
      sidebar={
        <div className="bg-white rounded-2xl ring-1 ring-outline-variant/30 p-5">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <Info className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display text-sm font-bold text-on-surface mb-2">
                Kenapa perlu daftar?
              </h3>
              <ul className="text-xs text-on-surface-variant space-y-1.5">
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-600 mt-0.5">✓</span>
                  <span>Buat profil perusahaan terpercaya</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-600 mt-0.5">✓</span>
                  <span>Akses talenta SMK terverifikasi</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-600 mt-0.5">✓</span>
                  <span>Kelola lowongan & lamaran</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {!googleAccount && (
          <>
            <GoogleAuthButton
              callbackURL="/auth/google-callback?next=%2Fregister%2Fcompany%2F1"
              label="Daftar dengan Google"
            />
            <div className="flex items-center gap-4 text-xs text-on-surface-variant">
              <span className="h-px flex-1 bg-outline-variant/40" />
              atau gunakan email
              <span className="h-px flex-1 bg-outline-variant/40" />
            </div>
          </>
        )}
        {googleError && (
          <div role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {googleError}
          </div>
        )}
        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        {/* Section 1: Akun */}
        <div className="space-y-4">
          <h2 className="font-display text-base font-bold text-on-surface">
            1. Informasi Akun
          </h2>

          <div>
            <label
              htmlFor="email"
              className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2"
            >
              Email Perusahaan <span className="text-red-500">*</span>
            </label>
            <input
              key={googleAccount?.email || 'email'}
              id="email"
              name="email"
              type="email"
              required
              readOnly={Boolean(googleAccount)}
              defaultValue={googleAccount?.email}
              placeholder="company@example.com"
              className="w-full px-4 py-3 rounded-xl border border-outline-variant/50 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
            />
            <p className="text-[11px] text-on-surface-variant mt-1.5">
              Gunakan email resmi perusahaan
            </p>
          </div>

          {!googleAccount && <div>
            <label
              htmlFor="password"
              className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2"
            >
              Password <span className="text-red-500">*</span>
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              placeholder="Minimal 8 karakter"
              className="w-full px-4 py-3 rounded-xl border border-outline-variant/50 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
            />
          </div>}

          {!googleAccount && <div>
            <label
              htmlFor="confirmPassword"
              className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2"
            >
              Konfirmasi Password <span className="text-red-500">*</span>
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              minLength={8}
              placeholder="Ulangi password"
              className="w-full px-4 py-3 rounded-xl border border-outline-variant/50 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
            />
          </div>}
        </div>

        {/* Section 2: Perwakilan */}
        <div className="space-y-4 pt-6 border-t border-outline-variant/30">
          <h2 className="font-display text-base font-bold text-on-surface">
            2. Informasi Perwakilan
          </h2>

          <div>
            <label
              htmlFor="fullName"
              className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2"
            >
              Nama Lengkap <span className="text-red-500">*</span>
            </label>
            <input
              key={googleAccount?.email || 'fullName'}
              id="fullName"
              name="fullName"
              type="text"
              required
              defaultValue={googleAccount?.fullName}
              placeholder="Nama Anda"
              className="w-full px-4 py-3 rounded-xl border border-outline-variant/50 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
            />
          </div>

          <div>
            <label
              htmlFor="position"
              className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2"
            >
              Jabatan <span className="text-red-500">*</span>
            </label>
            <select
              id="position"
              name="position"
              required
              className="w-full px-4 py-3 rounded-xl border border-outline-variant/50 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 bg-white"
            >
              <option value="">Pilih posisi</option>
              <option value="hr">HR Manager</option>
              <option value="recruiter">Recruiter</option>
              <option value="director">Director</option>
              <option value="owner">Owner</option>
              <option value="other">Lainnya</option>
            </select>
          </div>
        </div>

        {/* Terms */}
        <div className="pt-4 space-y-3">
          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              required
              className="mt-0.5 w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary"
            />
            <span className="text-xs text-on-surface-variant leading-relaxed">
              Saya menyetujui{' '}
              <a href="#" className="text-primary hover:underline font-medium">
                Ketentuan Layanan
              </a>{' '}
              dan{' '}
              <a href="#" className="text-primary hover:underline font-medium">
                Kebijakan Privasi
              </a>{' '}
              VocAZ.
            </span>
          </label>

          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              required
              className="mt-0.5 w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary"
            />
            <span className="text-xs text-on-surface-variant leading-relaxed">
              Saya mengonfirmasi bahwa saya berwenang untuk membuat dan mengelola
              akun perusahaan ini.
            </span>
          </label>
        </div>

        {/* Nav */}
        <StepNav
          prevHref="/join"
          onSubmit
          isPending={isPending}
          submitLabel="Buat Akun Perusahaan"
          submitLoadingLabel="Memproses..."
        />
      </form>
    </RegisterShell>
  )
}