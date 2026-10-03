// components/company/talent/invite-to-apply-modal.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  X,
  Loader2,
  Send,
  AlertCircle,
  CheckCircle2,
  Sparkles,
} from 'lucide-react'
import { inviteTalentToApplyAction } from '@/app/company/talent/actions'

type Job = {
  id: string
  title: string
}

type Props = {
  open: boolean
  onClose: () => void
  studentId: string
  studentName: string
  jobs: Job[]
  defaultJobId?: string
}

export function InviteToApplyModal({
  open,
  onClose,
  studentId,
  studentName,
  jobs,
  defaultJobId,
}: Props) {
  const router = useRouter()
  const [jobId, setJobId] = useState(defaultJobId ?? jobs[0]?.id ?? '')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleSubmit() {
    if (!jobId) {
      setError('Pilih lowongan')
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      const res = await inviteTalentToApplyAction({
        studentId,
        jobId,
        message: message.trim() || undefined,
      })

      if (!res.ok) {
        setError(res.error ?? 'Gagal kirim undangan')
        setSubmitting(false)
        return
      }

      setSuccess(true)
      setTimeout(() => {
        onClose()
        router.refresh()
      }, 1500)
    } catch (err) {
      console.error(err)
      setError('Terjadi kesalahan')
      setSubmitting(false)
    }
  }

  if (!open) return null

  const selectedJob = jobs.find((j) => j.id === jobId)

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={() => !submitting && onClose()}
    >
      <div
        className="bg-surface-container-lowest rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 p-6 border-b border-outline-variant/30">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary-container flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-on-surface">
                Undang Melamar
              </h2>
              <p className="text-xs text-on-surface-variant mt-0.5">
                {studentName}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="w-8 h-8 rounded-lg hover:bg-surface-container flex items-center justify-center text-on-surface-variant disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div className="p-3 rounded-xl bg-primary/5 border border-primary/20">
            <p className="text-xs text-on-surface">
              Kandidat akan menerima notifikasi untuk melamar lowongan yang
              kamu pilih. Undangan ini tidak otomatis membuat kandidat apply.
            </p>
          </div>

          {/* Job Selector */}
          <div>
            <label className="block text-sm font-semibold text-on-surface mb-2">
              Lowongan <span className="text-error">*</span>
            </label>
            <select
              value={jobId}
              onChange={(e) => setJobId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-transparent focus:border-primary/30 focus:bg-surface-container-lowest focus:outline-none text-sm font-semibold cursor-pointer"
            >
              <option value="">Pilih lowongan...</option>
              {jobs.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.title}
                </option>
              ))}
            </select>
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-semibold text-on-surface mb-2">
              Pesan (opsional)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              maxLength={1000}
              placeholder={`Halo ${studentName}, kami tertarik dengan profilmu untuk posisi ${selectedJob?.title ?? '...'}...`}
              className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-transparent focus:border-primary/30 focus:bg-surface-container-lowest focus:outline-none text-sm resize-y"
            />
            <div className="flex justify-end mt-1">
              <span className="text-[10px] text-on-surface-variant">
                {message.length} / 1000
              </span>
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-error/5 border border-error/20">
              <AlertCircle className="w-4 h-4 text-error shrink-0 mt-0.5" />
              <p className="text-xs text-error">{error}</p>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <p className="text-xs font-semibold text-emerald-800">
                Undangan berhasil dikirim!
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 p-4 border-t border-outline-variant/30 bg-surface-container-low/30">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="px-5 py-2.5 rounded-full bg-surface-container text-on-surface text-sm font-bold hover:bg-surface-container-high disabled:opacity-50 transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting || success || !jobId}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary text-white text-sm font-bold hover:bg-primary-container disabled:opacity-60 transition-colors"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Mengirim...
              </>
            ) : success ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Terkirim
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Kirim Undangan
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}