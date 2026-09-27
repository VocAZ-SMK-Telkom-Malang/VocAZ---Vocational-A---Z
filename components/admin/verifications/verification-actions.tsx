'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
  CheckCircle2,
  XCircle,
  Loader2,
  AlertCircle,
  PartyPopper,
} from 'lucide-react'
import {
  approveCompanyVerification,
  rejectCompanyVerification,
} from '@/lib/admin/actions'

type Props = {
  verificationId: string
  status: string
  companyName: string
}

export function VerificationActions({
  verificationId,
  status,
  companyName,
}: Props) {
  const router = useRouter()
  const [showApprove, setShowApprove] = useState(false)
  const [showReject, setShowReject] = useState(false)
  const [approveNotes, setApproveNotes] = useState('')
  const [rejectReason, setRejectReason] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleApprove() {
    setError(null)
    startTransition(async () => {
      const result = await approveCompanyVerification({
        verificationId,
        notes: approveNotes.trim() || undefined,
      })

      if (!result.ok) {
        setError(result.error || 'Gagal menyetujui')
        return
      }

      setShowApprove(false)
      router.refresh()
    })
  }

  function handleReject() {
    setError(null)

    if (rejectReason.trim().length < 5) {
      setError('Alasan minimal 5 karakter')
      return
    }

    startTransition(async () => {
      const result = await rejectCompanyVerification({
        verificationId,
        reason: rejectReason.trim(),
      })

      if (!result.ok) {
        setError(result.error || 'Gagal menolak')
        return
      }

      setShowReject(false)
      router.refresh()
    })
  }

  // Kalau sudah diproses
  if (status === 'approved') {
    return (
      <div className="bg-white rounded-2xl border border-emerald-200 p-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display text-base font-bold text-on-surface mb-1">
              Sudah Diverifikasi
            </h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Perusahaan ini sudah diverifikasi dan bisa mulai memposting
              lowongan.
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (status === 'rejected') {
    return (
      <div className="bg-white rounded-2xl border border-red-200 p-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center shrink-0">
            <XCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display text-base font-bold text-on-surface mb-1">
              Sudah Ditolak
            </h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Verifikasi perusahaan ini sudah ditolak sebelumnya.
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Pending — tampil tombol approve/reject
  return (
    <>
      <div className="bg-white rounded-2xl border border-outline-variant/30 p-6 sticky top-24">
        <h3 className="font-display text-base font-bold text-on-surface mb-4">
          Aksi Verifikasi
        </h3>

        <div className="space-y-2">
          <button
            onClick={() => {
              setShowApprove(true)
              setError(null)
            }}
            disabled={isPending}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-sm font-semibold shadow-[0_4px_16px_rgba(16,185,129,0.25)] hover:brightness-105 active:scale-95 transition-all disabled:opacity-50"
          >
            <CheckCircle2 className="w-4 h-4" />
            Setujui Verifikasi
          </button>

          <button
            onClick={() => {
              setShowReject(true)
              setError(null)
            }}
            disabled={isPending}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-red-50 border border-red-200 text-red-700 text-sm font-semibold hover:bg-red-100 transition-colors disabled:opacity-50"
          >
            <XCircle className="w-4 h-4" />
            Tolak Verifikasi
          </button>
        </div>

        <p className="text-[11px] text-on-surface-variant mt-4 leading-relaxed">
          ⚠️ Pastikan semua data & dokumen sudah sesuai sebelum menyetujui.
        </p>
      </div>

      {/* ============ APPROVE MODAL ============ */}
      {showApprove && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => !isPending && setShowApprove(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center">
                <PartyPopper className="w-7 h-7 text-emerald-600" />
              </div>
            </div>

            <h3 className="font-display text-lg font-bold text-on-surface text-center mb-2">
              Setujui Verifikasi?
            </h3>
            <p className="text-sm text-on-surface-variant text-center mb-5">
              Perusahaan <strong>{companyName}</strong> akan diverifikasi dan
              bisa mulai memposting lowongan.
            </p>

            <label className="block text-xs font-semibold text-on-surface-variant mb-1.5 uppercase tracking-wider">
              Catatan (Opsional)
            </label>
            <textarea
              value={approveNotes}
              onChange={(e) => setApproveNotes(e.target.value)}
              rows={2}
              placeholder="Catatan internal untuk verifikasi ini..."
              className="w-full px-3 py-2 rounded-lg border border-outline-variant/50 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 resize-none"
            />

            {error && (
              <div className="mt-3 flex items-start gap-2 text-xs text-red-600">
                <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 mt-5">
              <button
                onClick={() => setShowApprove(false)}
                disabled={isPending}
                className="px-4 py-2 text-sm font-semibold rounded-full hover:bg-surface-container transition-colors disabled:opacity-50"
              >
                Batal
              </button>
              <button
                onClick={handleApprove}
                disabled={isPending}
                className="px-5 py-2 text-sm font-semibold rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:brightness-105 disabled:opacity-50 flex items-center gap-2 shadow-sm"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Memproses...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Ya, Setujui</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============ REJECT MODAL ============ */}
      {showReject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => !isPending && setShowReject(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
                <XCircle className="w-7 h-7 text-red-600" />
              </div>
            </div>

            <h3 className="font-display text-lg font-bold text-on-surface text-center mb-2">
              Tolak Verifikasi?
            </h3>
            <p className="text-sm text-on-surface-variant text-center mb-5">
              Berikan alasan yang jelas agar perusahaan{' '}
              <strong>{companyName}</strong> bisa memperbaiki data mereka.
            </p>

            <label className="block text-xs font-semibold text-on-surface-variant mb-1.5 uppercase tracking-wider">
              Alasan Penolakan <span className="text-red-500">*</span>
            </label>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={3}
              placeholder="Contoh: Dokumen SIUP tidak terbaca dengan jelas"
              className="w-full px-3 py-2 rounded-lg border border-outline-variant/50 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 resize-none"
            />

            {error && (
              <div className="mt-3 flex items-start gap-2 text-xs text-red-600">
                <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 mt-5">
              <button
                onClick={() => setShowReject(false)}
                disabled={isPending}
                className="px-4 py-2 text-sm font-semibold rounded-full hover:bg-surface-container transition-colors disabled:opacity-50"
              >
                Batal
              </button>
              <button
                onClick={handleReject}
                disabled={isPending}
                className="px-5 py-2 text-sm font-semibold rounded-full bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Memproses...</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4" />
                    <span>Ya, Tolak</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}