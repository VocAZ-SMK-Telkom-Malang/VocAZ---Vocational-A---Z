// components/company/verification/verification-form.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Loader2,
  Send,
  CheckCircle2,
  AlertCircle,
  Shield,
  Info,
} from 'lucide-react'
import { DocumentUploader } from './document-uploader'
import { submitVerificationAction } from '@/app/company/verification/actions'

type Props = {
  isResubmit?: boolean
  reviewNotes?: string | null
}

export function VerificationForm({ isResubmit, reviewNotes }: Props) {
  const router = useRouter()

  const [legalDoc, setLegalDoc] = useState<{
    url: string
    key: string
    name: string
  } | null>(null)
  const [bizDoc, setBizDoc] = useState<{
    url: string
    key: string
    name: string
  } | null>(null)

  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit() {
    if (!legalDoc || !bizDoc) {
      setError('Lengkapi semua dokumen yang wajib')
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      const res = await submitVerificationAction({
        legalDocumentUrl: legalDoc.url,
        legalDocumentKey: legalDoc.key,
        businessRegistrationUrl: bizDoc.url,
        businessRegistrationKey: bizDoc.key,
      })

      if (!res.ok) {
        setError(res.error ?? 'Gagal submit')
        return
      }

      setSuccess(true)
      setTimeout(() => {
        router.refresh()
      }, 1500)
    } catch (err) {
      console.error(err)
      setError('Terjadi kesalahan')
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/30 p-8 lg:p-12 text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-emerald-600" />
        </div>
        <h2 className="text-xl font-black text-on-surface mb-2">
          🎉 Pengajuan Berhasil Dikirim!
        </h2>
        <p className="text-sm text-on-surface-variant max-w-md mx-auto">
          Tim admin akan meninjau dokumen kamu dalam 1-3 hari kerja. Kamu akan
          menerima notifikasi saat review selesai.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Resubmit Info */}
      {isResubmit && reviewNotes && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
              <Info className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-amber-900">
                Pengajuan Sebelumnya Ditolak
              </h3>
              <p className="text-xs text-amber-800 mt-1">{reviewNotes}</p>
              <p className="text-xs text-amber-700 mt-2 font-semibold">
                Silakan upload ulang dengan perbaikan.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Info Card */}
      <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <Shield className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-on-surface">
            Kenapa verifikasi penting?
          </h3>
          <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
            Verified Company mendapat badge khusus di semua halaman publik,
            meningkatkan trust kandidat, dan diprioritaskan dalam pencarian
            talenta.
          </p>
        </div>
      </div>

      {/* Documents */}
      <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/30 p-6 lg:p-8 space-y-6">
        <div>
          <h2 className="text-base font-bold text-on-surface">
            Dokumen Legal
          </h2>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Upload dokumen resmi perusahaan untuk diverifikasi.
          </p>
        </div>

        <DocumentUploader
          label="Dokumen Legal Utama"
          description="Contoh: NPWP, KTP Direktur, atau surat legal lainnya"
          currentUrl={legalDoc?.url ?? null}
          onUploaded={(url, key, name) =>
            setLegalDoc({ url, key, name })
          }
          onRemoved={() => setLegalDoc(null)}
        />

        <DocumentUploader
          label="Akta Pendirian / NIB / SIUP"
          description="Dokumen pendirian perusahaan yang sah"
          currentUrl={bizDoc?.url ?? null}
          onUploaded={(url, key, name) => setBizDoc({ url, key, name })}
          onRemoved={() => setBizDoc(null)}
        />
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2 p-4 rounded-2xl bg-error/5 border border-error/20">
          <AlertCircle className="w-4 h-4 text-error shrink-0 mt-0.5" />
          <p className="text-sm text-error">{error}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting || !legalDoc || !bizDoc}
          className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-primary to-primary-container text-white font-bold text-sm shadow-md hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Mengirim...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              {isResubmit ? 'Ajukan Ulang Verifikasi' : 'Kirim Verifikasi'}
            </>
          )}
        </button>
      </div>
    </div>
  )
}  