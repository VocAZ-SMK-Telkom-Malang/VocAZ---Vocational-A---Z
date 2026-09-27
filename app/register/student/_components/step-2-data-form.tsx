// app/register/student/_components/step-2-data-form.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { User, MapPin, GraduationCap, Info } from 'lucide-react'
import { RegisterShell } from '@/components/register/register-shell'
import { StepNav } from '@/components/register/step-nav'
import { REGISTER_STEPS } from '@/lib/register/steps'

type School = {
  id: string
  name: string
  city: string | null
  province: string | null
}

type Province = {
  id: string
  name: string
  code: string | null
}

type Props = {
  schools: School[]
  provinces: Province[]
}

const GENDERS = [
  { value: 'male', label: 'Laki-laki' },
  { value: 'female', label: 'Perempuan' },
  { value: 'other', label: 'Lainnya' },
]

export function Step2DataForm({ schools, provinces }: Props) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)
  const [noSchool, setNoSchool] = useState(false)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setIsPending(true)

    const formData = new FormData(e.currentTarget)
    const nisn = formData.get('nisn') as string
    const schoolId = noSchool ? '' : (formData.get('schoolId') as string)
    const gender = formData.get('gender') as string
    const dateOfBirth = formData.get('dateOfBirth') as string
    const city = formData.get('city') as string
    const province = formData.get('province') as string
    const enrollmentYear = formData.get('enrollmentYear') as string
    const graduationYear = formData.get('graduationYear') as string

    // Validasi
    if (nisn && !/^\d{10}$/.test(nisn)) {
      setError('NISN harus 10 digit angka')
      setIsPending(false)
      return
    }

    const existing = JSON.parse(
      sessionStorage.getItem('student-register') || '{}'
    )

    sessionStorage.setItem(
      'student-register',
      JSON.stringify({
        ...existing,
        nisn: nisn || undefined,
        schoolId: schoolId || undefined,
        gender: gender || undefined,
        dateOfBirth: dateOfBirth || undefined,
        city: city || undefined,
        province: province || undefined,
        enrollmentYear: enrollmentYear ? parseInt(enrollmentYear) : undefined,
        graduationYear: graduationYear ? parseInt(graduationYear) : undefined,
      })
    )

    router.push('/register/student/3')
    setIsPending(false)
  }

  const currentYear = new Date().getFullYear()

  return (
    <RegisterShell
      role="student"
      steps={REGISTER_STEPS.student}
      currentStep={2}
      title="Ceritakan Tentang Dirimu"
      description="Data ini membantu kami merekomendasikan lowongan dan peluang yang cocok untukmu."
      sidebar={<WhyWeNeedThis />}
    >
      <form onSubmit={handleSubmit} className="space-y-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        {/* SECTION 1: Identitas */}
        <div className="space-y-5">
          <SectionHeader icon={User} title="1. Identitas" />

          <div>
            <label
              htmlFor="nisn"
              className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2"
            >
              NISN
              <span className="text-on-surface-variant/70 ml-1 font-normal normal-case">
                (Opsional)
              </span>
            </label>
            <input
              id="nisn"
              name="nisn"
              type="text"
              inputMode="numeric"
              maxLength={10}
              placeholder="10 digit NISN"
              className="w-full px-4 py-3 rounded-xl border border-outline-variant/50 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="gender"
                className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2"
              >
                Jenis Kelamin
              </label>
              <select
                id="gender"
                name="gender"
                className="w-full px-4 py-3 rounded-xl border border-outline-variant/50 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 bg-white"
              >
                <option value="">Pilih...</option>
                {GENDERS.map((g) => (
                  <option key={g.value} value={g.value}>
                    {g.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="dateOfBirth"
                className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2"
              >
                Tanggal Lahir
              </label>
              <input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                max={new Date().toISOString().slice(0, 10)}
                className="w-full px-4 py-3 rounded-xl border border-outline-variant/50 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: Pendidikan */}
        <div className="space-y-5 pt-6 border-t border-outline-variant/30">
          <SectionHeader icon={GraduationCap} title="2. Pendidikan" />

          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={noSchool}
              onChange={(e) => setNoSchool(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary"
            />
            <span className="text-xs text-on-surface-variant leading-relaxed">
              Saya belum/tidak sedang bersekolah (alumni, gap year, dll)
            </span>
          </label>

          {!noSchool && (
            <div>
              <label
                htmlFor="schoolId"
                className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2"
              >
                Sekolah
              </label>
              <select
                id="schoolId"
                name="schoolId"
                className="w-full px-4 py-3 rounded-xl border border-outline-variant/50 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 bg-white"
              >
                <option value="">Pilih sekolah...</option>
                {schools.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} {s.city ? `— ${s.city}` : ''}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-on-surface-variant mt-1.5">
                Tidak ada di daftar? Pilih "belum/tidak sekolah" di atas.
              </p>
            </div>
          )}

          {!noSchool && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="enrollmentYear"
                  className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2"
                >
                  Tahun Masuk
                </label>
                <input
                  id="enrollmentYear"
                  name="enrollmentYear"
                  type="number"
                  min={2000}
                  max={currentYear}
                  placeholder="2023"
                  className="w-full px-4 py-3 rounded-xl border border-outline-variant/50 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                />
              </div>
              <div>
                <label
                  htmlFor="graduationYear"
                  className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2"
                >
                  Tahun Lulus
                </label>
                <input
                  id="graduationYear"
                  name="graduationYear"
                  type="number"
                  min={2000}
                  max={currentYear + 5}
                  placeholder="2026"
                  className="w-full px-4 py-3 rounded-xl border border-outline-variant/50 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                />
              </div>
            </div>
          )}
        </div>

        {/* SECTION 3: Lokasi */}
        <div className="space-y-5 pt-6 border-t border-outline-variant/30">
          <SectionHeader icon={MapPin} title="3. Lokasi" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="province"
                className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2"
              >
                Provinsi
              </label>
              <select
                id="province"
                name="province"
                className="w-full px-4 py-3 rounded-xl border border-outline-variant/50 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 bg-white"
              >
                <option value="">Pilih provinsi...</option>
                {provinces.map((p) => (
                  <option key={p.id} value={p.name}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
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
                placeholder="Jakarta Selatan"
                className="w-full px-4 py-3 rounded-xl border border-outline-variant/50 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
              />
            </div>
          </div>
        </div>

        <StepNav
          prevHref="/register/student/1"
          onSubmit
          isPending={isPending}
          submitLabel="Simpan & Lanjutkan"
          submitLoadingLabel="Menyimpan..."
        />
      </form>
    </RegisterShell>
  )
}

// ============================================
// SUB-COMPONENTS
// ============================================

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

function WhyWeNeedThis() {
  return (
    <div className="bg-white rounded-2xl ring-1 ring-outline-variant/30 p-5">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
          <Info className="w-4 h-4" />
        </div>
        <div>
          <h3 className="font-display text-sm font-bold text-on-surface mb-2">
            Kenapa kami butuh ini?
          </h3>
          <p className="text-xs text-on-surface-variant mb-3 leading-relaxed">
            Data ini membantu kami mencocokkan kamu dengan lowongan dan
            perusahaan yang tepat.
          </p>
          <ul className="text-xs text-on-surface-variant space-y-2">
            {[
              'Rekomendasi lowongan lebih akurat',
              'Terhubung dengan BKK sekolah',
              'Verifikasi talenta oleh industri',
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