// components/company/applicants/applicant-interview-panel.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Calendar, User, Loader2, Save, AlertCircle, CheckCircle2 } from 'lucide-react'
import { setInterviewAction } from '@/app/company/jobs/[id]/applicants/actions'

type Props = {
  applicationId: string
  initialInterviewDate: string | null
  initialNextStep: string | null
  initialRecruiterName: string | null
  defaultRecruiterName?: string
}

export function ApplicantInterviewPanel({
  applicationId,
  initialInterviewDate,
  initialNextStep,
  initialRecruiterName,
  defaultRecruiterName,
}: Props) {
  const router = useRouter()
  const [editing, setEditing] = useState(false)
  const [interviewDate, setInterviewDate] = useState(
    initialInterviewDate
      ? new Date(initialInterviewDate).toISOString().slice(0, 16)
      : ''
  )
  const [nextStep, setNextStep] = useState(initialNextStep ?? '')
  const [recruiterName, setRecruiterName] = useState(
    initialRecruiterName ?? defaultRecruiterName ?? ''
  )
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

async function handleSave() {
  console.log('[NotesPanel] Saving:', { applicationId })

  setSaving(true)
  setError(null)
  setSuccess(false)

  try {
    const res = await setInterviewAction({
      applicationId,
      interviewDate,
      nextStep,
      recruiterName,
    })

    console.log('[NotesPanel] Result:', res)

    if (!res.success) {
      setError(res.error ?? 'Gagal simpan')
      return
    }

    setSuccess(true)
    setTimeout(() => setSuccess(false), 2000)

    // ✅ Refresh LANGSUNG
    router.refresh()
  } catch (err) {
    console.error('[NotesPanel] Error:', err)
    setError('Terjadi kesalahan. Cek console.')
  } finally {
    setSaving(false)
  }
}

  if (!editing && !initialInterviewDate) {
    return (
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-5">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-bold text-on-surface">Interview</h3>
        </div>
        <p className="text-xs text-on-surface-variant mb-3">
          Belum ada jadwal interview
        </p>
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="w-full py-2 rounded-full bg-primary text-white text-sm font-bold hover:bg-primary-container transition-colors"
        >
          Jadwalkan Interview
        </button>
      </div>
    )
  }

  if (!editing && initialInterviewDate) {
    return (
      <div className="bg-indigo-50 rounded-2xl border border-indigo-200 p-5">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-4 h-4 text-indigo-700" />
          <h3 className="text-sm font-bold text-indigo-900">
            Interview Dijadwalkan
          </h3>
        </div>

        <div className="space-y-2 text-xs text-indigo-800">
          <div>
            <span className="font-mono uppercase tracking-wider text-[10px] opacity-70">
              Tanggal
            </span>
            <div className="font-bold">
              {new Date(initialInterviewDate).toLocaleString('id-ID', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
          </div>
          {initialRecruiterName && (
            <div>
              <span className="font-mono uppercase tracking-wider text-[10px] opacity-70">
                PIC
              </span>
              <div className="font-bold">{initialRecruiterName}</div>
            </div>
          )}
          {initialNextStep && (
            <div>
              <span className="font-mono uppercase tracking-wider text-[10px] opacity-70">
                Next Step
              </span>
              <div className="font-bold">{initialNextStep}</div>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => setEditing(true)}
          className="mt-4 w-full py-2 rounded-full bg-white text-indigo-700 border border-indigo-300 text-sm font-bold hover:bg-indigo-100 transition-colors"
        >
          Ubah Jadwal
        </button>
      </div>
    )
  }

  return (
    <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-5">
      <div className="flex items-center gap-2 mb-3">
        <Calendar className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-bold text-on-surface">
          {initialInterviewDate ? 'Ubah Interview' : 'Jadwalkan Interview'}
        </h3>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-xs font-semibold text-on-surface mb-1">
            Tanggal & Waktu
          </label>
          <input
            type="datetime-local"
            value={interviewDate}
            onChange={(e) => setInterviewDate(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-surface-container-low border border-transparent focus:border-primary/30 focus:bg-surface-container-lowest focus:outline-none text-sm transition"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-on-surface mb-1">
            PIC (Recruiter)
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-on-surface-variant" />
            <input
              type="text"
              value={recruiterName}
              onChange={(e) => setRecruiterName(e.target.value)}
              placeholder="Nama recruiter"
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-surface-container-low border border-transparent focus:border-primary/30 focus:bg-surface-container-lowest focus:outline-none text-sm transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-on-surface mb-1">
            Next Step
          </label>
          <textarea
            value={nextStep}
            onChange={(e) => setNextStep(e.target.value)}
            rows={2}
            placeholder="Contoh: Technical interview via Zoom"
            className="w-full px-3 py-2 rounded-lg bg-surface-container-low border border-transparent focus:border-primary/30 focus:bg-surface-container-lowest focus:outline-none text-sm transition resize-y"
          />
        </div>

        {error && (
          <div className="flex items-start gap-2 p-2 rounded-lg bg-error/5 border border-error/20">
            <AlertCircle className="w-3.5 h-3.5 text-error shrink-0 mt-0.5" />
            <p className="text-[11px] text-error">{error}</p>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-50 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <p className="text-[11px] text-emerald-700 font-semibold">
              Interview berhasil disimpan
            </p>
          </div>
        )}

        <div className="flex items-center gap-2 pt-2">
          <button
            type="button"
            onClick={() => setEditing(false)}
            disabled={saving}
            className="flex-1 py-2 rounded-full bg-surface-container text-on-surface text-sm font-bold hover:bg-surface-container-high disabled:opacity-50 transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex-1 inline-flex items-center justify-center gap-2 py-2 rounded-full bg-primary text-white text-sm font-bold hover:bg-primary-container disabled:opacity-60 transition-colors"
          >
            {saving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                Simpan
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
