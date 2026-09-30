// app/register/school/_components/step-2-payment.tsx
'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
  Check,
  Loader2,
  ShieldCheck,
  Lock,
  Info,
  AlertCircle,
} from 'lucide-react'
import { RegisterShell } from '@/components/register/register-shell'
import { StepNav } from '@/components/register/step-nav'
import { REGISTER_STEPS } from '@/lib/register/steps'
import {
  SCHOOL_PLANS,
  PAYMENT_METHODS,
  type PaymentMethodId,
} from '@/lib/register/school-plans'

export function Step2Payment() {
  const router = useRouter()
  const [selected, setSelected] = useState<PaymentMethodId | null>(null)
  const [isPaying, setIsPaying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isPending, startTransition] = useTransition()

  // Ambil plan dari sessionStorage
  const [plan, setPlan] = useState(() => {
    if (typeof window === 'undefined') return null
    const data = JSON.parse(
      sessionStorage.getItem('school-register') || '{}'
    )
    return SCHOOL_PLANS.find((p) => p.id === data.plan) || null
  })

  function handlePayment() {
    if (!selected || !plan) {
      setError('Pilih metode pembayaran dulu')
      return
    }

    setError(null)
    setIsPaying(true)

    // Simulasi proses pembayaran (mock)
    setTimeout(() => {
      setIsPaying(false)
      setSuccess(true)

      // Generate reference number (mock)
      const reference = `VOCAZ-SCH-${Date.now().toString(36).toUpperCase()}`

      // Simpan ke sessionStorage
      const existing = JSON.parse(
        sessionStorage.getItem('school-register') || '{}'
      )
      sessionStorage.setItem(
        'school-register',
        JSON.stringify({
          ...existing,
          paymentMethod: selected,
          paymentReference: reference,
          paidAt: new Date().toISOString(),
        })
      )

      // Redirect setelah 1.5 detik
      setTimeout(() => {
        startTransition(() => {
          router.push('/register/school/3')
        })
      }, 1500)
    }, 1800)
  }

  if (!plan) {
    return (
      <RegisterShell
        role="school"
        steps={REGISTER_STEPS.school}
        currentStep={2}
        title="Pilih Paket Dulu"
        description="Kamu belum memilih paket."
        backHref="/"
      >
        <div className="text-center py-8">
          <p className="text-sm text-on-surface-variant mb-4">
            Silakan pilih paket dulu sebelum melanjutkan ke pembayaran.
          </p>
          <button
            type="button"
            onClick={() => router.push('/register/school/1')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white font-display font-semibold text-sm shadow-md hover:bg-primary-container transition"
          >
            Kembali ke Pilih Paket
          </button>
        </div>
      </RegisterShell>
    )
  }

  return (
    <RegisterShell
      role="school"
      steps={REGISTER_STEPS.school}
      currentStep={2}
      title="Pembayaran Langganan"
      description="Pilih metode pembayaran. Ini adalah simulasi — tidak ada transaksi nyata."
      sidebar={<OrderSummary plan={plan} />}
    >
      <div className="space-y-6">
        {/* Payment success state */}
        {success ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
              <Check
                className="w-10 h-10 text-emerald-600"
                strokeWidth={3}
              />
            </div>
            <h3 className="font-display text-xl font-extrabold text-on-surface mb-2">
              Pembayaran Berhasil!
            </h3>
            <p className="text-sm text-on-surface-variant mb-3">
              Terima kasih. Mengalihkan ke langkah berikutnya...
            </p>
            <Loader2 className="w-5 h-5 text-primary animate-spin" />
          </div>
        ) : isPaying ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
            <h3 className="font-display text-lg font-bold text-on-surface mb-2">
              Memproses Pembayaran...
            </h3>
            <p className="text-xs text-on-surface-variant">
              Mohon tunggu sebentar. Jangan tutup halaman ini.
            </p>
          </div>
        ) : (
          <>
            {error && (
              <div className="flex items-start gap-2 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Info banner */}
            <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-50 border border-blue-200">
              <Info className="w-4 h-4 text-blue-700 mt-0.5 shrink-0" />
              <div className="text-xs text-blue-800 leading-relaxed">
                <span className="font-semibold block mb-0.5">
                  Mode Simulasi
                </span>
                Ini adalah halaman pembayaran simulasi untuk demo. Tidak ada
                transaksi nyata yang akan diproses.
              </div>
            </div>

            {/* Payment methods grid */}
            <div>
              <h3 className="font-display text-base font-bold text-on-surface mb-3">
                Pilih Metode Pembayaran
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PAYMENT_METHODS.map((method) => {
                  const isActive = selected === method.id
                  return (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setSelected(method.id)}
                      className={`flex items-center gap-3 p-4 rounded-2xl text-left transition-all ${
                        isActive
                          ? 'ring-2 ring-primary bg-primary/5'
                          : 'ring-1 ring-outline-variant/40 bg-surface-container-lowest hover:ring-primary/30 hover:bg-surface-container-low'
                      }`}
                    >
                      <div
                        className={`w-11 h-11 rounded-xl flex items-center justify-center text-2xl shrink-0 ${
                          isActive
                            ? 'bg-primary/10'
                            : 'bg-surface-container'
                        }`}
                      >
                        {method.icon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-display text-sm font-bold text-on-surface truncate">
                            {method.name}
                          </span>
                          {isActive && (
                            <Check
                              className="w-4 h-4 text-primary shrink-0"
                              strokeWidth={3}
                            />
                          )}
                        </div>
                        <p className="text-[11px] text-on-surface-variant line-clamp-2">
                          {method.description}
                        </p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Security note */}
            <div className="flex items-center gap-2 text-[11px] text-on-surface-variant">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>
                Pembayaran aman & terenkripsi. VocAZ tidak menyimpan data
                kartu.
              </span>
            </div>
          </>
        )}

        {/* Nav */}
        {!success && !isPaying && (
          <StepNav
            prevHref="/register/school/1"
            onSubmit={false}
            onNext={handlePayment}
            nextLabel="Bayar Sekarang"
            nextDisabled={!selected}
          />
        )}
      </div>
    </RegisterShell>
  )
}

// ============================================
// ORDER SUMMARY (sidebar)
// ============================================

function OrderSummary({ plan }: { plan: (typeof SCHOOL_PLANS)[number] }) {
  const Icon = plan.icon

  return (
    <div className="space-y-4">
      <div className="bg-surface-container-lowest rounded-2xl ring-1 ring-outline-variant/30 p-5">
        <div className="flex items-center gap-2 mb-4">
          <Lock className="w-4 h-4 text-on-surface-variant" />
          <h3 className="font-display text-sm font-bold text-on-surface">
            Ringkasan Pesanan
          </h3>
        </div>

        <div className="flex items-center gap-3 pb-4 mb-4 border-b border-outline-variant/20">
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
              plan.popular
                ? 'bg-gradient-to-br from-[#ff5757] to-[#dc2626] text-white'
                : 'bg-surface-container text-primary'
            }`}
          >
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <p className="font-display text-sm font-bold text-on-surface">
              Paket {plan.name}
            </p>
            <p className="text-[11px] text-on-surface-variant">
              {plan.tagline}
            </p>
          </div>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-on-surface-variant">Kuota siswa</span>
            <span className="font-semibold text-on-surface">
              {plan.studentQuota}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-on-surface-variant">Admin BKK</span>
            <span className="font-semibold text-on-surface">
              {plan.adminQuota}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-on-surface-variant">Durasi</span>
            <span className="font-semibold text-on-surface">12 bulan</span>
          </div>
        </div>

        <div className="pt-4 mt-4 border-t border-outline-variant/20 space-y-1">
          <div className="flex justify-between items-baseline">
            <span className="text-xs text-on-surface-variant">Total</span>
            <span className="font-display text-xl font-extrabold text-primary">
              {plan.priceDisplay}
            </span>
          </div>
          <p className="text-[10px] text-on-surface-variant text-right">
            untuk 12 bulan pertama
          </p>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-primary/5 ring-1 ring-primary/10 text-xs leading-relaxed text-on-surface-variant">
        <span className="font-semibold text-on-surface block mb-0.5">
          Bisa upgrade kapan saja
        </span>
        Butuh kuota lebih besar? Bisa upgrade paket atau tambah kuota dengan
        prorata.
      </div>
    </div>
  )
}