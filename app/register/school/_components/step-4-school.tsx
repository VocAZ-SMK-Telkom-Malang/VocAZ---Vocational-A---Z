// app/register/school/_components/step-4-school.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Building2, MapPin, User, Info } from 'lucide-react'
import { RegisterShell } from '@/components/register/register-shell'
import { StepNav } from '@/components/register/step-nav'
import { REGISTER_STEPS } from '@/lib/register/steps'

const ACCREDITATIONS = ['A', 'B', 'C']

export function Step4School() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setIsPending(true)

    const formData = new FormData(e.currentTarget)

    const schoolName = (formData.get('schoolName') as string)?.trim()
    const npsn = (formData.get('npsn') as string)?.trim()
    const accreditation = formData.get('accreditation') as string
    const address = (formData.get('address') as string)?.trim()
    const city = (formData.get('city') as string)?.trim()
    const province = (formData.get('province') as string)?.trim()
    const bkkName = (formData.get('bkkName') as string)?.trim()
    const bkkContact = (formData.get('bkkContact') as string)?.trim()
    const bkkEmail = (formData.get('bkkEmail') as string)?.trim()
    const bkkPhone = (formData.get('bkkPhone') as string)?.trim()

    if (!schoolName || schoolName.length < 3) {
      setError('Nama sekolah minimal 3 karakter')
      setIsPending(false)
      return
    }

    const existing = JSON.parse(
      sessionStorage.getItem('school-register') || '{}'
    )

    sessionStorage.setItem(
      'school-register',
      JSON.stringify({
        ...existing,
        schoolName,
        npsn: npsn || undefined,
        level: 'smk',
        accreditation: accreditation || undefined,
        address: address || undefined,
        city: city || undefined,
        province: province || undefined,
        bkkName: bkkName || undefined,
        bkkContact: bkkContact || undefined,
        bkkEmail: bkkEmail || undefined,
        bkkPhone: bkkPhone || undefined,
      })
    )

    router.push('/register/school/5')
    setIsPending(false)
  }

  return (
    <RegisterShell
      role="school"
      steps={REGISTER_STEPS.school}
      currentStep={4}
      title="Data Sekolah"
      description="Ceritakan tentang sekolah Anda. Data ini akan tampil di halaman sekolah publik."
      sidebar={<WhyCard />}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        {/* Section 1: Identitas Sekolah */}
        <div className="space-y-5">
          <SectionHeader icon={Building2} title="1. Identitas Sekolah" />

          <div>
            <label
              htmlFor="schoolName"
              className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2"
            >
              Nama Sekolah <span className="text-red-500">*</span>
            </label>
            <input
              id="schoolName"
              name="schoolName"
              type="text"
              required
              placeholder="SMK Negeri 4 Surakarta"
              className="w-full px-4 py-3 rounded-xl border border-outline-variant/50 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="npsn"
                className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2"
              >
                NPSN
                <span className="text-on-surface-variant/70 ml-1 font-normal normal-case">
                  (Opsional)
                </span>
              </label>
              <input
                id="npsn"
                name="npsn"
                type="text"
                inputMode="numeric"
                maxLength={8}
                placeholder="20123456"
                className="w-full px-4 py-3 rounded-xl border border-outline-variant/50 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
              />
            </div>

            <div>
              <label
                htmlFor="accreditation"
                className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2"
              >
                Akreditasi
              </label>
              <select
                id="accreditation"
                name="accreditation"
                className="w-full px-4 py-3 rounded-xl border border-outline-variant/50 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 bg-white"
              >
                <option value="">Pilih akreditasi</option>
                {ACCREDITATIONS.map((a) => (
                  <option key={a} value={a}>
                    Akreditasi {a}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">
              Jenjang
            </label>
            <div className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-primary/5 ring-1 ring-primary/15">
              <span className="text-sm font-semibold text-primary">
                SMK (Sekolah Menengah Kejuruan)
              </span>
            </div>
            <p className="text-[11px] text-on-surface-variant mt-1.5">
              Saat ini VocAZ fokus untuk SMK &amp; BKK SMK
            </p>
          </div>
        </div>

        {/* Section 2: Lokasi */}
        <div className="space-y-5 pt-6 border-t border-outline-variant/30">
          <SectionHeader icon={MapPin} title="2. Lokasi Sekolah" />

          <div>
            <label
              htmlFor="address"
              className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2"
            >
              Alamat Lengkap
            </label>
            <textarea
              id="address"
              name="address"
              rows={3}
              placeholder="Jl. Adi Sucipto No. 40, Jajar, Laweyan"
              className="w-full px-4 py-3 rounded-xl border border-outline-variant/50 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="city"
                className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2"
              >
                Kota/Kabupaten
              </label>
              <input
                id="city"
                name="city"
                type="text"
                placeholder="Surakarta"
                className="w-full px-4 py-3 rounded-xl border border-outline-variant/50 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
              />
            </div>
            <div>
              <label
                htmlFor="province"
                className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2"
              >
                Provinsi
              </label>
              <input
                id="province"
                name="province"
                type="text"
                placeholder="Jawa Tengah"
                className="w-full px-4 py-3 rounded-xl border border-outline-variant/50 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
              />
            </div>
          </div>
        </div>

        {/* Section 3: BKK */}
        <div className="space-y-5 pt-6 border-t border-outline-variant/30">
          <SectionHeader icon={User} title="3. Info BKK Sekolah" />

          <div>
            <label
              htmlFor="bkkName"
              className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2"
            >
              Nama BKK
            </label>
            <input
              id="bkkName"
              name="bkkName"
              type="text"
              placeholder="BKK SMKN 4 Surakarta"
              className="w-full px-4 py-3 rounded-xl border border-outline-variant/50 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
            />
          </div>

          <div>
            <label
              htmlFor="bkkContact"
              className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2"
            >
              Nama Kontak PIC BKK
            </label>
            <input
              id="bkkContact"
              name="bkkContact"
              type="text"
              placeholder="Budi Santoso"
              className="w-full px-4 py-3 rounded-xl border border-outline-variant/50 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="bkkEmail"
                className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2"
              >
                Email BKK
              </label>
              <input
                id="bkkEmail"
                name="bkkEmail"
                type="email"
                placeholder="bkk@smkn4solo.sch.id"
                className="w-full px-4 py-3 rounded-xl border border-outline-variant/50 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
              />
            </div>
            <div>
              <label
                htmlFor="bkkPhone"
                className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2"
              >
                Telepon BKK
              </label>
              <input
                id="bkkPhone"
                name="bkkPhone"
                type="tel"
                placeholder="+62 812 3456 7890"
                className="w-full px-4 py-3 rounded-xl border border-outline-variant/50 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
              />
            </div>
          </div>
        </div>

        <StepNav
          prevHref="/register/school/3"
          onSubmit
          isPending={isPending}
          submitLabel="Lanjutkan"
          submitLoadingLabel="Memproses..."
        />
      </form>
    </RegisterShell>
  )
}

function SectionHeader({
  icon: Icon,
  title,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
}) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
        <Icon className="w-4 h-4" />
      </div>
      <h2 className="font-display text-base font-bold text-on-surface">
        {title}
      </h2>
    </div>
  )
}

function WhyCard() {
  return (
    <div className="bg-surface-container-lowest rounded-2xl ring-1 ring-outline-variant/30 p-5">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
          <Info className="w-4 h-4" />
        </div>
        <div>
          <h3 className="font-display text-sm font-bold text-on-surface mb-2">
            Kenapa kami butuh ini?
          </h3>
          <p className="text-xs text-on-surface-variant mb-3 leading-relaxed">
            Data sekolah akan tampil di halaman sekolah publik sebagai identitas
            resmi BKK Anda.
          </p>
          <ul className="text-xs text-on-surface-variant space-y-2">
            {[
              'Halaman sekolah publik & terverifikasi',
              'Siswa dapat menemukan sekolah lewat kode',
              'Sumber data tracer study',
              'Bagian dari ekosistem BNSP',
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