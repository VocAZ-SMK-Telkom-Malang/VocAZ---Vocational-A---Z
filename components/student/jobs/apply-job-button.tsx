// components/student/jobs/apply-job-button.tsx
'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
  Send,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  FileText,
} from 'lucide-react'
import { applyJob } from '@/lib/student/actions'

type Props = {
  jobId: string
  jobTitle: string
  companyName: string
  hasApplied: boolean
  applicationStatus?: string | null
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  submitted: { label: 'Terkirim', color: 'bg-blue-100 text-blue-700' },
  reviewed: { label: 'Ditinjau', color: 'bg-amber-100 text-amber-700' },
  shortlisted: { label: 'Shortlist', color: 'bg-purple-100 text-purple-700' },
  interview: { label: 'Interview', color: 'bg-indigo-100 text-indigo-700' },
  offered: { label: 'Ditawari', color: 'bg-emerald-100 text-emerald-700' },
  hired: { label: 'Diterima', color: 'bg-emerald-100 text-emerald-700' },
  rejected: { label: 'Ditolak', color: 'bg-red-100 text-red-700' },
  withdrawn: { label: 'Dibatalkan', color: 'bg-gray-100 text-gray-700' },
}

export function ApplyJobButton({
  jobId,
  jobTitle,
  companyName,
  hasApplied,
  applicationStatus,
}: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [coverLetter, setCoverLetter] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isPending, startTransition] = useTransition()

  // Kalau sudah pernah lamar → tampilkan status
  if (hasApplied && applicationStatus) {
    const status = STATUS_LABELS[applicationStatus] || STATUS_LABELS.submitted
    return (
      <div className="flex items-center gap-2 flex-wrap">
        <div className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-surface-container text-sm font-semibold text-on-surface">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Sudah dilamar</span>
        </div>
        <span
          className={`inline-flex items-center px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${status.color}`}
        >
          {status.label}
        </span>
      </div>
    )
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    startTransition(async () => {
      const result = await applyJob({
        jobId,
        coverLetter: coverLetter.trim() || undefined,
      })

      if (!result.ok) {
        setError(result.error || 'Gagal melamar')
        return
      }

      setSuccess(true)
      setTimeout(() => {
        setOpen(false)
        router.refresh()
      }, 1500)
    })
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary-container to-[#E03E3E] text-white font-display text-sm font-semibold px-6 py-3 rounded-full shadow-[0_8px_20px_rgba(220,38,38,0.25)] hover:brightness-105 hover:-translate-y-0.5 active:scale-[0.98] transition-all"
      >
        <Send className="w-4 h-4" />
        <span>Lamar Sekarang</span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => !isPending && setOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 p-6 border-b border-outline-variant/30">
              <div className="min-w-0">
                <h2 className="font-display text-lg font-extrabold text-on-surface mb-1">
                  Lamar Lowongan
                </h2>
                <p className="text-xs text-on-surface-variant truncate">
                  <strong className="text-on-surface">{jobTitle}</strong> di{' '}
                  {companyName}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={isPending}
                className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors shrink-0 disabled:opacity-40"
                aria-label="Tutup"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {success ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-3">
                    <CheckCircle2
                      className="w-8 h-8 text-emerald-600"
                      strokeWidth={2.5}
                    />
                  </div>
                  <h3 className="font-display text-base font-bold text-on-surface mb-1">
                    Lamaran Terkirim!
                  </h3>
                  <p className="text-xs text-on-surface-variant">
                    Perusahaan akan meninjau lamaranmu.
                  </p>
                </div>
              ) : (
                <>
                  {error && (
                    <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
                      <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <div>
                    <label
                      htmlFor="coverLetter"
                      className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2"
                    >
                      Surat Lamaran
                      <span className="text-on-surface-variant/70 ml-1 font-normal normal-case">
                        (Opsional)
                      </span>
                    </label>
                    <textarea
                      id="coverLetter"
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      rows={6}
                      maxLength={1000}
                      placeholder="Ceritakan kenapa kamu cocok untuk posisi ini..."
                      className="w-full px-4 py-3 rounded-xl border border-outline-variant/50 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 resize-none"
                    />
                    <p className="text-[11px] text-on-surface-variant mt-1.5 text-right">
                      {coverLetter.length}/1000 karakter
                    </p>
                  </div>

                  <div className="flex items-start gap-2 p-3 rounded-xl bg-blue-50 border border-blue-200">
                    <FileText className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                    <p className="text-xs text-blue-800 leading-relaxed">
                      Profil VocAZ kamu akan otomatis dikirim sebagai resume.
                      Pastikan profil & portfolio sudah lengkap.
                    </p>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      disabled={isPending}
                      className="flex-1 px-5 py-3 rounded-full ring-1 ring-outline-variant text-sm font-semibold text-on-surface hover:bg-surface-container-low transition-colors disabled:opacity-40"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={isPending}
                      className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary-container to-[#E03E3E] text-white font-display text-sm font-semibold px-6 py-3 rounded-full shadow-[0_8px_20px_rgba(220,38,38,0.25)] hover:brightness-105 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Mengirim...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Kirim Lamaran</span>
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      )}
    </>
  )
}