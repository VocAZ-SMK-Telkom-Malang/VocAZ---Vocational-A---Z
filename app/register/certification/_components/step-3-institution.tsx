// app/register/certification/_components/step-3-institution.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Building2, MapPin, Shield, Info } from 'lucide-react'
import { RegisterShell } from '@/components/register/register-shell'
import { StepNav } from '@/components/register/step-nav'
import { REGISTER_STEPS } from '@/lib/register/steps'

export function Step3Institution() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)

  const [type] = useState(() => {
    if (typeof window === 'undefined') return null
    const data = JSON.parse(
      sessionStorage.getItem('certification-register') || '{}'
    )
    return data.type as 'lsp_bnsp' | 'industry' | null
  })

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setIsPending(true)

    const fd = new FormData(e.currentTarget)
    const institutionName = (fd.get('institutionName') as string)?.trim()
    const licenseNumber = (fd.get('licenseNumber') as string)?.trim()

    if (!institutionName || institutionName.length < 3) {
      setError('Nama lembaga minimal 3 karakter')
      setIsPending(false)
      return
    }

    if (type === 'lsp_bnsp' && !licenseNumber) {
      setError('Nomor SK BNSP wajib untuk LSP')
      setIsPending(false)
      return
    }

    const existing = JSON.parse(
      sessionStorage.getItem('certification-register') || '{}'
    )

    sessionStorage.setItem(
      'certification-register',
      JSON.stringify({
        ...existing,
        institutionName,
        licenseNumber: licenseNumber || undefined,
        emailInstitution: (fd.get('emailInstitution') as string)?.trim() || undefined,
        phone: (fd.get('phone') as string)?.trim() || undefined,
        website: (fd.get('website') as string)?.trim() || undefined,
        address: (fd.get('address') as string)?.trim() || undefined,
        description: (fd.get('description') as string)?.trim() || undefined,
      })
    )

    router.push('/register/certification/4')
    setIsPending(false)
  }

  const isLsp = type === 'lsp_bnsp'

  return (
    <RegisterShell
      role="certification"
      steps={REGISTER_STEPS.certification}
      currentStep={3}
      title="Data Lembaga Sertifikasi"
      description="Lengkapi data lembaga Anda. Data ini akan tampil di halaman publik dan di setiap sertifikat yang diverifikasi."
      sidebar={
        <div className="bg-surface-container-lowest rounded-2xl ring-1 ring-outline-variant/30 p-5">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <Info className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display text-sm font-bold text-on-surface mb-2">
                {isLsp ? 'LSP BNSP' : 'Industri & Pelatihan'}
                </h3>
              <p className="text-xs text-on-surface-variant leading-relaxed mb-3">
                {isLsp
                  ? 'Nomor SK BNSP wajib untuk verifikasi.'
                  : 'Nomor registrasi mitra (opsional tapi dianjurkan).'}
              </p>
              <ul className="text-xs text-on-surface-variant space-y-2">
                {(isLsp
                  ? ['Badge Garuda Emas di profil siswa', 'Prioritas di pencarian']
                  : ['Badge Centang Biru', 'Terhubung dengan industri']
                ).map((item) => (
                  <li key={item} className="flex items-start gap-1.5">
                    <span className="text-emerald-600 mt-0.5 shrink-0">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        {/* Section 1: Identitas Lembaga */}
        <div className="space-y-5">
          <SectionHeader icon={Building2} title="1. Identitas Lembaga" />

          <div>
            <label
              htmlFor="institutionName"
              className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2"
            >
              Nama Lembaga <span className="text-red-500">*</span>
            </label>
            <input
              id="institutionName"
              name="institutionName"
              type="text"
              required
              placeholder={
                isLsp
                  ? 'LSP P1 SMK Negeri 4 Surakarta'
                  : 'Mikrotik Academy Indonesia'
              }
              className="w-full px-4 py-3 rounded-xl border border-outline-variant/50 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
            />
          </div>

          <div>
            <label
              htmlFor="licenseNumber"
              className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2"
            >
              {isLsp ? 'Nomor SK BNSP' : 'Nomor Registrasi Mitra'}
              {isLsp && <span className="text-red-500 ml-1">*</span>}
              {!isLsp && (
                <span className="text-on-surface-variant/70 ml-1 font-normal normal-case">
                  (Opsional)
                </span>
              )}
            </label>
            <div className="relative">
              <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
              <input
                id="licenseNumber"
                name="licenseNumber"
                type="text"
                required={isLsp}
                placeholder={
                  isLsp ? 'SK/BNSP/2024/1234' : 'REG-MTCNA-2024-001'
                }
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-outline-variant/50 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2"
            >
              Deskripsi
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              maxLength={500}
              placeholder="Ceritakan singkat tentang lembaga sertifikasi Anda..."
              className="w-full px-4 py-3 rounded-xl border border-outline-variant/50 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 resize-none"
            />
          </div>
        </div>

        {/* Section 2: Kontak */}
        <div className="space-y-5 pt-6 border-t border-outline-variant/30">
          <SectionHeader icon={MapPin} title="2. Kontak & Lokasi" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="emailInstitution"
                className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2"
              >
                Email Lembaga
              </label>
              <input
                id="emailInstitution"
                name="emailInstitution"
                type="email"
                placeholder="info@lembaga.id"
                className="w-full px-4 py-3 rounded-xl border border-outline-variant/50 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
              />
            </div>
            <div>
              <label
                htmlFor="phone"
                className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2"
              >
                Nomor Telepon
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+62 812 3456 7890"
                className="w-full px-4 py-3 rounded-xl border border-outline-variant/50 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="website"
              className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2"
            >
              Website
            </label>
            <input
              id="website"
              name="website"
              type="url"
              placeholder="https://lembaga.id"
              className="w-full px-4 py-3 rounded-xl border border-outline-variant/50 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
            />
          </div>

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
              placeholder="Jl. Contoh No. 123, Kota, Provinsi"
              className="w-full px-4 py-3 rounded-xl border border-outline-variant/50 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 resize-none"
            />
          </div>
        </div>

        <StepNav
          prevHref="/register/certification/2"
          onSubmit
          isPending={isPending}
          submitLabel="Kirim Pendaftaran"
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