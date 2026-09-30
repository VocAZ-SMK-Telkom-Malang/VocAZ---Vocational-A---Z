// app/register/school/_components/step-1-plan.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Sparkles, Check, X, HelpCircle } from 'lucide-react'
import Link from 'next/link'
import { RegisterShell } from '@/components/register/register-shell'
import { StepNav } from '@/components/register/step-nav'
import { PlanCard } from '@/components/register/plan-card'
import { ComparisonTable } from '@/components/register/comparison-table'
import { REGISTER_STEPS } from '@/lib/register/steps'
import { SCHOOL_PLANS, type SchoolPlanId } from '@/lib/register/school-plans'

const FAQS = [
  {
    q: 'Apakah data siswa akan hilang kalau langganan berhenti?',
    a: 'Tidak. Data siswa dan alumni tidak pernah dihapus. Akun hanya dibekukan sementara dan bisa aktif kembali kapan saja ketika sekolah berlangganan lagi.',
  },
  {
    q: 'Apakah alumni dihitung dalam kuota?',
    a: 'Tidak. Kuota hanya berlaku untuk siswa aktif. Alumni bebas tanpa batas di semua paket.',
  },
  {
    q: 'Apakah ada biaya tersembunyi?',
    a: 'Tidak ada. Harga sudah termasuk semua fitur sesuai paket, integrasi BNSP, dan halaman sekolah terverifikasi.',
  },
  {
    q: 'Bagaimana kalau jumlah siswa lebih dari 1.000?',
    a: 'Hubungi tim kami untuk paket custom atau tambahan kuota. Kami fleksibel menyesuaikan kebutuhan sekolah.',
  },
]

export function Step1Plan() {
  const router = useRouter()
  const [selected, setSelected] = useState<SchoolPlanId | null>(null)
  const [isPending, setIsPending] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  function handleSelect(planId: SchoolPlanId) {
    setSelected(planId)
  }

  function handleNext() {
    if (!selected) {
      return
    }

    const plan = SCHOOL_PLANS.find((p) => p.id === selected)
    if (!plan) return

    setIsPending(true)
    const existing = JSON.parse(
      sessionStorage.getItem('school-register') || '{}'
    )
    sessionStorage.setItem(
      'school-register',
      JSON.stringify({
        ...existing,
        plan: selected,
        planPrice: plan.price,
      })
    )
    router.push('/register/school/2')
    setIsPending(false)
  }

  return (
    <RegisterShell
      role="school"
      steps={REGISTER_STEPS.school}
      currentStep={1}
      title="Pilih Paket BKK Sekolah"
      description="Setiap paket memberikan alat kerja nyata untuk BKK — dashboard, tracer study, analytics, dan integrasi BNSP."
    >
      <div className="space-y-8">
        {/* Header note */}
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-primary/5 ring-1 ring-primary/15">
          <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="text-xs leading-relaxed text-on-surface-variant">
            <span className="font-semibold text-on-surface block mb-0.5">
              Pilot gratis untuk sekolah awal
            </span>
            Sekolah terpilih bisa mencoba VocAZ tanpa biaya selama masa pilot.
            Hubungi tim kami setelah mendaftar.
          </div>
        </div>

        {/* 3 Plan Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {SCHOOL_PLANS.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              selected={selected === plan.id}
              onSelect={handleSelect}
            />
          ))}
        </div>

        {/* Comparison Table */}
        <div>
          <div className="mb-4">
            <h3 className="font-display text-lg font-bold text-on-surface mb-1">
              Bandingkan Paket
            </h3>
            <p className="text-xs text-on-surface-variant">
              Detail fitur tiap paket untuk menemukan yang paling sesuai.
            </p>
          </div>
          <ComparisonTable />
        </div>

        {/* FAQ */}
        <div>
          <div className="mb-4">
            <h3 className="font-display text-lg font-bold text-on-surface mb-1">
              Pertanyaan Umum
            </h3>
            <p className="text-xs text-on-surface-variant">
              Belum yakin? Ini beberapa pertanyaan yang sering ditanyakan.
            </p>
          </div>
          <div className="space-y-2">
            {FAQS.map((faq, i) => (
              <div
                key={i}
                className="rounded-xl ring-1 ring-outline-variant/30 bg-surface-container-lowest overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between gap-3 px-5 py-3.5 text-left hover:bg-surface-container-low/50 transition-colors"
                >
                  <span className="text-sm font-semibold text-on-surface">
                    {faq.q}
                  </span>
                  <HelpCircle
                    className={`w-4 h-4 text-on-surface-variant shrink-0 transition-transform ${
                      openFaq === i ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 text-xs text-on-surface-variant leading-relaxed border-t border-outline-variant/20 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom nav — pakai StepNav custom */}
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
            <span>Lanjut ke Pembayaran</span>
            <ArrowLeft className="w-4 h-4 rotate-180" />
          </button>
        </div>
      </div>
    </RegisterShell>
  )
}