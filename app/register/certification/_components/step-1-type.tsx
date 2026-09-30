// app/register/certification/_components/step-1-type.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ShieldCheck, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { RegisterShell } from '@/components/register/register-shell'
import { TypeCard } from '@/components/register/type-card'
import { REGISTER_STEPS } from '@/lib/register/steps'
import {
  CERT_INSTITUTION_TYPES,
  type CertInstitutionTypeId,
} from '@/lib/register/certification-data'

export function Step1Type() {
  const router = useRouter()
  const [selected, setSelected] = useState<CertInstitutionTypeId | null>(null)
  const [isPending, setIsPending] = useState(false)

  function handleNext() {
    if (!selected) return
    setIsPending(true)

    const existing = JSON.parse(
      sessionStorage.getItem('certification-register') || '{}'
    )
    sessionStorage.setItem(
      'certification-register',
      JSON.stringify({ ...existing, type: selected })
    )
    router.push('/register/certification/2')
    setIsPending(false)
  }

  return (
    <RegisterShell
      role="certification"
      steps={REGISTER_STEPS.certification}
      currentStep={1}
      title="Pilih Tipe Lembaga Sertifikasi"
      description="Setiap tipe punya cara verifikasi dan badge yang berbeda. Pilih yang paling sesuai dengan lembaga Anda."
      sidebar={
        <div className="bg-surface-container-lowest rounded-2xl ring-1 ring-outline-variant/30 p-5">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display text-sm font-bold text-on-surface mb-2">
                Kenapa gabung VocAZ?
              </h3>
              <ul className="text-xs text-on-surface-variant space-y-2">
                {[
                  'Gratis untuk semua lembaga',
                  'Terhubung dengan talenta SMK',
                  'Verifikasi sertifikat digital',
                  'Badge terpercaya di profil siswa',
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
      }
    >
      <div className="space-y-6">
        {/* Info banner */}
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-primary/5 ring-1 ring-primary/15">
          <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="text-xs leading-relaxed text-on-surface-variant">
            <span className="font-semibold text-on-surface block mb-0.5">
              2 Kategori Sertifikasi
            </span>
            <strong>Tier 1 (Garuda Emas):</strong> LSP BNSP — sertifikasi
            profesi nasional. <br />
            <strong>Tier 2 (Centang Biru):</strong> Vendor industri & LPK —
            sertifikasi industri/pelatihan.
          </div>
        </div>

        {/* Type cards */}
        <div className="grid grid-cols-1 gap-4">
          {CERT_INSTITUTION_TYPES.map((type) => (
            <TypeCard
              key={type.id}
              type={type}
              selected={selected === type.id}
              onSelect={setSelected}
            />
          ))}
        </div>

        {/* Nav */}
        <div className="flex items-center justify-between gap-3 pt-6 mt-8 border-t border-outline-variant/30">
          <Link
            href="/join"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full ring-1 ring-outline-variant text-sm font-semibold text-on-surface hover:bg-surface-container-low transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali</span>
          </Link>

          <button
            type="button"
            onClick={handleNext}
            disabled={!selected || isPending}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-container to-[#E03E3E] text-white font-display text-sm font-semibold px-6 py-2.5 rounded-full shadow-[0_8px_20px_rgba(220,38,38,0.25)] hover:brightness-105 hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 transition-all"
          >
            <span>Lanjutkan</span>
            <ArrowLeft className="w-4 h-4 rotate-180" />
          </button>
        </div>
      </div>
    </RegisterShell>
  )
}