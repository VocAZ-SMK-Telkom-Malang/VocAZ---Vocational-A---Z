'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
  CheckCircle2,
  XCircle,
  Loader2,
  AlertCircle,
  Trash2,
} from 'lucide-react'
import { resolveContentReport } from '@/lib/admin/actions'

type Props = {
  reportId: string
  status: string
}

export function ReportActions({ reportId, status }: Props) {
  const router = useRouter()
  const [showModal, setShowModal] = useState<'resolve' | 'dismiss' | null>(
    null
  )
  const [note, setNote] = useState('')
  const [deleteContent, setDeleteContent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(action: 'resolved' | 'dismissed') {
    setError(null)

    if (note.trim().length < 3) {
      setError('Catatan minimal 3 karakter')
      return
    }

    startTransition(async () => {
      const result = await resolveContentReport({
        reportId,
        action,
        resolutionNote: note.trim(),
        deleteContent: action === 'resolved' && deleteContent,
      })

      if (!result.ok) {
        setError(result.error || 'Gagal memproses')
        return
      }

      setShowModal(null)
      router.refresh()
    })
  }

  if (status !== 'pending') {
    return (
      <div className="bg-white rounded-2xl border border-outline-variant/30 p-6 sticky top-24">
        <h3 className="font-display text-base font-bold text-on-surface mb-3">
          Status Laporan
        </h3>
        <p className="text-sm text-on-surface-variant leading-relaxed">
          Laporan ini sudah{' '}
          <strong>
            {status === 'resolved'
              ? 'diselesaikan'
              : status === 'dismissed'
              ? 'diabaikan'
              : status}
          </strong>
          .
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="bg-white rounded-2xl border border-outline-variant/30 p-6 sticky top-24">
        <h3 className="font-display text-base font-bold text-on-surface mb-4">
          Aksi Moderasi
        </h3>

        <div className="space-y-2">
          <button
            onClick={() => {
              setShowModal('resolve')
              setError(null)
              setNote('')
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-sm font-semibold shadow-[0_4px_16px_rgba(16,185,129,0.25)] hover:brightness-105 active:scale-95 transition-all"
          >
            <CheckCircle2 className="w-4 h-4" />
            Selesaikan
          </button>

          <button
            onClick={() => {
              setShowModal('dismiss')
              setError(null)
              setNote('')
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-white border border-outline-variant text-on-surface text-sm font-semibold hover:bg-surface-container-low transition-colors"
          >
            <XCircle className="w-4 h-4" />
            Abaikan
          </button>
        </div>

        <p className="text-[11px] text-on-surface-variant mt-4 leading-relaxed">
          ⚠️ Pastikan sudah mereview konten sebelum mengambil tindakan.
        </p>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => !isPending && setShowModal(null)}
          />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h3 className="font-display text-lg font-bold text-on-surface mb-2">
              {showModal === 'resolve'
                ? 'Selesaikan Laporan'
                : 'Abaikan Laporan'}
            </h3>
            <p className="text-sm text-on-surface-variant mb-4">
              {showModal === 'resolve'
                ? 'Laporan ini akan ditandai sebagai diselesaikan.'
                : 'Laporan ini akan diabaikan (bukan pelanggaran).'}
            </p>

            <label className="block text-xs font-semibold text-on-surface-variant mb-1.5 uppercase tracking-wider">
              Catatan <span className="text-red-500">*</span>
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              placeholder={
                showModal === 'resolve'
                  ? 'Contoh: Konten melanggar aturan, sudah dihapus'
                  : 'Contoh: Setelah direview, konten tidak melanggar aturan'
              }
              className="w-full px-3 py-2 rounded-lg border border-outline-variant/50 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 resize-none"
            />

            {/* Checkbox delete content */}
            {showModal === 'resolve' && (
              <label className="flex items-start gap-2.5 mt-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={deleteContent}
                  onChange={(e) => setDeleteContent(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary"
                />
                <span className="text-xs text-on-surface-variant leading-relaxed">
                  <span className="flex items-center gap-1 font-semibold text-red-600 mb-0.5">
                    <Trash2 className="w-3 h-3" />
                    Hapus konten yang dilaporkan
                  </span>
                  Konten akan dihapus dari database
                </span>
              </label>
            )}

            {error && (
              <div className="mt-3 flex items-start gap-2 text-xs text-red-600">
                <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 mt-5">
              <button
                onClick={() => setShowModal(null)}
                disabled={isPending}
                className="px-4 py-2 text-sm font-semibold rounded-full hover:bg-surface-container transition-colors disabled:opacity-50"
              >
                Batal
              </button>
              <button
                onClick={() =>
                  handleSubmit(
                    showModal === 'resolve' ? 'resolved' : 'dismissed'
                  )
                }
                disabled={isPending}
                className={`px-5 py-2 text-sm font-semibold rounded-full text-white disabled:opacity-50 flex items-center gap-2 ${
                  showModal === 'resolve'
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'bg-gray-600 hover:bg-gray-700'
                }`}
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Memproses...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Konfirmasi</span>
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