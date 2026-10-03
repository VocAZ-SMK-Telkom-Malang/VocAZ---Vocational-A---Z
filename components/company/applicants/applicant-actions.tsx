// components/company/applicants/applicant-actions.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  CheckCircle2,
  XCircle,
  MessageSquare,
  Download,
  Loader2,
} from 'lucide-react'
import {
  rejectApplicantAction,
  hireApplicantAction,
} from '@/app/company/jobs/[id]/applicants/actions'

type Props = {
  applicationId: string
  studentUserId: string
  currentStatus: string
  resumeUrl: string | null
}

export function ApplicantActions({
  applicationId,
  studentUserId,
  currentStatus,
  resumeUrl,
}: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [rejectReason, setRejectReason] = useState('')

  async function handleHire() {
    if (!confirm('Yakin kandidat ini diterima?')) return
    setLoading('hire')
    const res = await hireApplicantAction(applicationId)
    setLoading(null)
    if (res.success) {
      router.refresh()
    } else {
      alert(res.error ?? 'Gagal')
    }
  }

  async function handleReject() {
    setLoading('reject')
    const res = await rejectApplicantAction({
      applicationId,
      reason: rejectReason || undefined,
    })
    setLoading(null)
    if (res.success) {
      setShowRejectModal(false)
      setRejectReason('')
      router.refresh()
    } else {
      alert(res.error ?? 'Gagal')
    }
  }

  const canHire = currentStatus !== 'hired' && currentStatus !== 'rejected'
  const canReject = currentStatus !== 'rejected'

  return (
    <>
      <div className="flex flex-col gap-2">
        {canHire && (
          <button
            type="button"
            onClick={handleHire}
            disabled={loading === 'hire'}
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-full bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 disabled:opacity-60 transition-colors"
          >
            {loading === 'hire' ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <CheckCircle2 className="w-4 h-4" />
            )}
            Terima Kandidat
          </button>
        )}

        {canReject && (
          <button
            type="button"
            onClick={() => setShowRejectModal(true)}
            disabled={loading === 'reject'}
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-full bg-surface-container text-error text-sm font-bold hover:bg-error/10 disabled:opacity-60 transition-colors"
          >
            <XCircle className="w-4 h-4" />
            Tolak Kandidat
          </button>
        )}

        <a
          href={`/company/messages?to=${studentUserId}`}
          className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-full bg-primary/10 text-primary text-sm font-bold hover:bg-primary/20 transition-colors"
        >
          <MessageSquare className="w-4 h-4" />
          Kirim Pesan
        </a>

        {resumeUrl && (
          <a
            href={resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-full bg-surface-container text-on-surface text-sm font-bold hover:bg-surface-container-high transition-colors"
          >
            <Download className="w-4 h-4" />
            Download CV
          </a>
        )}
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => !loading && setShowRejectModal(false)}
        >
          <div
            className="bg-surface-container-lowest rounded-2xl max-w-md w-full shadow-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base font-bold text-on-surface mb-2">
              Tolak Kandidat?
            </h3>
            <p className="text-sm text-on-surface-variant mb-4">
              Kandidat akan dapat notifikasi kalau lamarannya tidak lolos.
            </p>

            <label className="block text-xs font-semibold text-on-surface mb-1">
              Alasan (opsional)
            </label>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={3}
              placeholder="Contoh: Kualifikasi belum sesuai"
              className="w-full px-3 py-2 rounded-lg bg-surface-container-low border border-transparent focus:border-error/30 focus:bg-surface-container-lowest focus:outline-none text-sm resize-y mb-4"
            />

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowRejectModal(false)}
                disabled={loading === 'reject'}
                className="flex-1 py-2.5 rounded-full bg-surface-container text-on-surface text-sm font-bold hover:bg-surface-container-high disabled:opacity-50 transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleReject}
                disabled={loading === 'reject'}
                className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-full bg-error text-white text-sm font-bold hover:bg-error/80 disabled:opacity-60 transition-colors"
              >
                {loading === 'reject' ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  'Tolak'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}