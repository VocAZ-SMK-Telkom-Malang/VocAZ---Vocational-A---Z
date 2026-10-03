// app/company/verification/verification-client.tsx
'use client'

import { ShieldCheck, Shield } from 'lucide-react'
import { VerificationStatusBanner } from '@/components/company/verification/verification-status-banner'
import { VerificationForm } from '@/components/company/verification/verification-form'
import { VerificationHistory } from '@/components/company/verification/verification-history'
import type { VerificationState } from '@/lib/queries/company-verification'

type Props = {
  state: VerificationState
}

export function CompanyVerificationClient({ state }: Props) {
  const {
    currentStatus,
    verifiedAt,
    latestSubmission,
    history,
    canSubmit,
    canResubmit,
  } = state

  const showForm = canSubmit || canResubmit

  return (
    <div className="max-w-[1000px] mx-auto flex flex-col gap-6 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4">
          <ShieldCheck className="w-3.5 h-3.5 text-primary" />
          <span className="font-mono text-[10px] uppercase tracking-[0.15em] font-bold text-primary">
            Company Verification
          </span>
        </div>
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tight text-on-surface">
          Verifikasi Perusahaan
        </h1>
        <p className="text-sm text-on-surface-variant mt-2 max-w-2xl">
          Dapatkan badge <span className="font-bold text-emerald-600">Verified</span> untuk
          meningkatkan trust kandidat dan diprioritaskan di Smart Talent Match.
        </p>
      </div>

      {/* Status Banner */}
      <VerificationStatusBanner
        status={currentStatus}
        reviewNotes={latestSubmission?.reviewNotes ?? null}
        verifiedAt={verifiedAt}
      />

      {/* Form (kalau bisa submit / resubmit) */}
      {showForm && (
        <VerificationForm
          isResubmit={canResubmit}
          reviewNotes={
            canResubmit ? latestSubmission?.reviewNotes ?? null : null
          }
        />
      )}

      {/* Info kalau sedang pending/in_review */}
      {(currentStatus === 'pending' || currentStatus === 'in_review') && (
        <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
            <Shield className="w-5 h-5 text-blue-700" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-blue-900">
              Sedang Dalam Review
            </h3>
            <p className="text-xs text-blue-800 mt-1 leading-relaxed">
              Kamu akan menerima notifikasi begitu admin selesai meninjau
              dokumen. Biasanya proses ini memakan waktu 1–3 hari kerja.
            </p>
          </div>
        </div>
      )}

      {/* Info kalau sudah verified */}
      {currentStatus === 'verified' && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 text-emerald-700" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-emerald-900">
              Perusahaan Terverifikasi
            </h3>
            <p className="text-xs text-emerald-800 mt-1 leading-relaxed">
              Badge Verified sudah aktif di seluruh platform. Kamu tidak perlu
              submit ulang.
            </p>
          </div>
        </div>
      )}

      {/* History */}
      {history.length > 0 && (
        <VerificationHistory submissions={history} />
      )}
    </div>
  )
}