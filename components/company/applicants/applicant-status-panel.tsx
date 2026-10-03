// components/company/applicants/applicant-status-panel.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { updateApplicantStatusAction } from '@/app/company/jobs/[id]/applicants/actions'

const STATUS_OPTIONS = [
  { value: 'submitted', label: 'Lamaran Terkirim', color: 'bg-blue-500' },
  { value: 'reviewed', label: 'Sedang Ditinjau', color: 'bg-amber-500' },
  { value: 'shortlisted', label: 'Shortlist', color: 'bg-purple-500' },
  { value: 'interview', label: 'Interview', color: 'bg-indigo-500' },
  { value: 'offered', label: 'Ditawari', color: 'bg-emerald-500' },
  { value: 'hired', label: 'Diterima', color: 'bg-emerald-600' },
  { value: 'rejected', label: 'Ditolak', color: 'bg-rose-500' },
]

type Props = {
  applicationId: string
  currentStatus: string
}

export function ApplicantStatusPanel({ applicationId, currentStatus }: Props) {
  const router = useRouter()
  const [status, setStatus] = useState(currentStatus)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const current = STATUS_OPTIONS.find((s) => s.value === status)

  async function handleChange(newStatus: string) {
    if (newStatus === status || saving) return

    console.log('[StatusPanel] Changing to:', newStatus)
    setSaving(true)
    setError(null)
    setSuccess(false)

    try {
      const res = await updateApplicantStatusAction({
        applicationId,
        newStatus,
        note: `Status diubah ke ${newStatus}`,
      })

      console.log('[StatusPanel] Result:', res)

      if (!res?.success) {
        setError(res?.error ?? 'Gagal update')
        setSaving(false)
        return
      }

      setStatus(newStatus)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 2500)

      router.refresh()
    } catch (err) {
      console.error('[StatusPanel] Error:', err)
      setError('Terjadi kesalahan. Cek console browser.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-5">
      <h3 className="text-sm font-bold text-on-surface mb-3">Status Lamaran</h3>

      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-container border border-outline-variant/40 font-mono text-xs font-bold mb-4">
        <span
          className={`w-2 h-2 rounded-full ${current?.color ?? 'bg-gray-500'}`}
        />
        {current?.label}
        {saving && <Loader2 className="w-3 h-3 animate-spin ml-1" />}
      </div>

      <div className="space-y-1">
        {STATUS_OPTIONS.map((opt) => {
          const isActive = opt.value === status
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => handleChange(opt.value)}
              disabled={saving || isActive}
              className={`
                w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-left text-sm transition-colors
                ${
                  isActive
                    ? 'bg-primary/10 text-primary font-bold cursor-default'
                    : 'text-on-surface hover:bg-surface-container disabled:opacity-50'
                }
              `}
            >
              <span className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${opt.color}`} />
                {opt.label}
              </span>
              {isActive && <CheckCircle2 className="w-4 h-4" />}
            </button>
          )
        })}
      </div>

      {error && (
        <div className="mt-3 flex items-start gap-2 p-2 rounded-lg bg-error/5 border border-error/20">
          <AlertCircle className="w-3.5 h-3.5 text-error shrink-0 mt-0.5" />
          <p className="text-[11px] text-error">{error}</p>
        </div>
      )}

      {success && (
        <div className="mt-3 flex items-center gap-2 p-2 rounded-lg bg-emerald-50 border border-emerald-200">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <p className="text-[11px] text-emerald-700 font-semibold">
            Status berhasil diubah
          </p>
        </div>
      )}
    </div>
  )
}