// components/company/dashboard/security-verification.tsx
import { CheckCircle2, ShieldCheck } from 'lucide-react'
import type { VerificationSummary } from '@/lib/queries/company-dashboard'

export function SecurityVerification({
  summary,
}: {
  summary: VerificationSummary
}) {
  return (
    <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-5">
      <div className="flex items-center gap-2 mb-1">
        <ShieldCheck className="w-4 h-4 text-primary" />
        <h3 className="text-base font-bold text-on-surface">
          Keamanan &amp; Verifikasi
        </h3>
      </div>
      <p className="text-[11px] text-on-surface-variant mb-4">
        Kualitas profil dari himpunan pelamar Anda.
      </p>

      <div className="mb-4">
        <div className="flex items-end justify-between mb-2">
          <div className="text-3xl font-extrabold text-on-surface leading-none">
            {summary.overallScore}%
          </div>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-mono text-[10px] font-bold">
            <CheckCircle2 className="w-3 h-3" />
            Verified
          </span>
        </div>

        <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-primary-container rounded-full transition-all"
            style={{ width: `${summary.overallScore}%` }}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2 pt-3 border-t border-outline-variant/30">
        <LegendRow
          color="bg-emerald-500"
          label="BNSP Certified"
          value={`${summary.bnspPercent}%`}
        />
        <LegendRow
          color="bg-primary"
          label="Sekolah Verified"
          value={`${summary.schoolVerifiedPercent}%`}
        />
      </div>

      <div className="mt-4 pt-3 border-t border-outline-variant/30">
        <div className="font-mono text-[10px] text-on-surface-variant">
          Dari {summary.totalApplicantsReviewed.toLocaleString('id-ID')} pelamar
          yang ditinjau
        </div>
      </div>
    </div>
  )
}

function LegendRow({
  color,
  label,
  value,
}: {
  color: string
  label: string
  value: string
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${color}`} />
        <span className="text-xs text-on-surface-variant">{label}</span>
      </div>
      <span className="font-mono text-[11px] font-bold text-on-surface">
        {value}
      </span>
    </div>
  )
}