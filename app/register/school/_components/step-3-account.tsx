// app/register/school/_components/step-3-account.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { RegisterShell } from '@/components/register/register-shell'
import { StepNav } from '@/components/register/step-nav'
import { REGISTER_STEPS } from '@/lib/register/steps'
import { Info } from 'lucide-react'

export function Step3Account() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setIsPending(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string
    const fullName = formData.get('fullName') as string
    const position = formData.get('position') as string

    if (password !== confirmPassword) {
      setError('Password dan konfirmasi password tidak cocok')
      setIsPending(false)
      return
    }

    if (password.length < 8) {
      setError('Password minimal 8 karakter')
      setIsPending(false)
      return
    }

    const existing = JSON.parse(
      sessionStorage.getItem('school-register') || '{}'
    )

    sessionStorage.setItem(
      'school-register',
      JSON.stringify({ ...existing, email, password, fullName, position })
    )

    router.push('/register/school/4')
    setIsPending(false)
  }

  return (
    <RegisterShell
      role="school"
      steps={REGISTER_STEPS.school}
      currentStep={3}
      title="Buat Akun PIC Sekolah"
      description="Akun ini akan menjadi admin utama BKK sekolah Anda."
      sidebar={<InfoCard />}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
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
              Email Sekolah <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="bkk@smkn4solo.sch.id"
              className="w-full px-4 py-3 rounded-xl border border-outline-variant/50 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
            />
            <p className="text-[11px] text-on-surface-variant mt-1.5">
              Gunakan email resmi sekolah atau BKK
            </p>
          </div>

          <div>
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
          </div>

          <div>
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
          </div>
        </div>

        {/* Section 2: PIC */}
        <div className="space-y-4 pt-6 border-t border-outline-variant/30">
          <h2 className="font-display text-base font-bold text-on-surface">
            2. Informasi Penanggung Jawab
          </h2>

          <div>
            <label
              htmlFor="fullName"
              className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2"
            >
              Nama Lengkap <span className="text-red-500">*</span>
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              required
              placeholder="Nama lengkap PIC"
              className="w-full px-4 py-3 rounded-xl border border-outline-variant/50 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
            />
          </div>

          <div>
            <label
              htmlFor="position"
              className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2"
            >
              Jabatan
            </label>
            <select
              id="position"
              name="position"
              className="w-full px-4 py-3 rounded-xl border border-outline-variant/50 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 bg-white"
            >
              <option value="">Pilih jabatan</option>
              <option value="kepala_sekolah">Kepala Sekolah</option>
              <option value="wakil_kepala">Wakil Kepala Sekolah</option>
              <option value="ketua_bkk">Ketua BKK</option>
              <option value="staf_bkk">Staf BKK</option>
              <option value="kaprodi">Kepala Program Keahlian</option>
              <option value="guru_bk">Guru BK</option>
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
              Saya berwenang untuk mewakili sekolah dan mengelola akun BKK ini.
            </span>
          </label>
        </div>

        <StepNav
          prevHref="/register/school/2"
          onSubmit
          isPending={isPending}
          submitLabel="Lanjutkan"
          submitLoadingLabel="Memproses..."
        />
      </form>
    </RegisterShell>
  )
}

function InfoCard() {
  return (
    <div className="bg-surface-container-lowest rounded-2xl ring-1 ring-outline-variant/30 p-5">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
          <Info className="w-4 h-4" />
        </div>
        <div>
          <h3 className="font-display text-sm font-bold text-on-surface mb-2">
            Akun Admin BKK
          </h3>
          <p className="text-xs text-on-surface-variant leading-relaxed mb-3">
            Akun ini adalah admin utama. Anda bisa mengundang admin lain setelah
            sekolah terverifikasi.
          </p>
          <ul className="text-xs text-on-surface-variant space-y-2">
            {[
              'Kelola siswa & alumni',
              'Approve siswa baru',
              'Lihat tracer study',
              'Generate kode sekolah',
            ].map((item) => (
              <li key={item} className="flex items-start gap-1.5">
                <span className="text-emerald-600 mt-0.5 shrink-0">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}