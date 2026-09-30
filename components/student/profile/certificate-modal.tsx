// components/student/profile/certificate-modal.tsx
'use client'

import { useState, useTransition, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  X,
  Plus,
  Loader2,
  Upload,
  Trash2,
  FileCheck,
  AlertCircle,
  BadgeCheck,
  Shield,
} from 'lucide-react'
import {
  addCertificate,
  updateCertificate,
} from '@/app/actions/certifications'
import { uploadFile } from '@/lib/storage/upload-client'

type Certificate = {
  id: string
  title: string
  certificateNumber: string | null
  issuedDate: string | null
  expiredDate: string | null
  documentUrl: string | null
  documentKey: string | null
  badgeType: string
  verificationStatus: string
  institutionName: string | null
}

type Verifier = {
  id: string
  name: string
  slug: string
  type: string
  logoUrl: string | null
}

type Props = {
  existing?: Certificate
  verifiers: Verifier[]
  studentProfileId: string
  onClose: () => void
}

const BADGE_TYPES = [
  { value: 'lsp_bnsp', label: 'LSP / BNSP' },
  { value: 'industry', label: 'Industri' },
  { value: 'training', label: 'Pelatihan' },
] as const

export function CertificateModal({
  existing,
  verifiers,
  studentProfileId,
  onClose,
}: Props) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [isPending, startTransition] = useTransition()
  const [isUploading, setIsUploading] = useState(false)

  const [form, setForm] = useState({
    title: existing?.title ?? '',
    certificateNumber: existing?.certificateNumber ?? '',
    issuedDate: existing?.issuedDate?.slice(0, 10) ?? '',
    expiredDate: existing?.expiredDate?.slice(0, 10) ?? '',
    badgeType: (existing?.badgeType ?? 'industry') as
      | 'lsp_bnsp'
      | 'industry'
      | 'training',
  })

  const [docUrl, setDocUrl] = useState(existing?.documentUrl ?? '')
  const [docKey, setDocKey] = useState(existing?.documentKey ?? '')
  const [requestVerif, setRequestVerif] = useState(false)
  const [verifierId, setVerifierId] = useState('')
  const [error, setError] = useState<string | null>(null)

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setError(null)

    const result = await uploadFile(file, 'portfolio', studentProfileId)

    if (result.ok) {
      setDocUrl(result.url)
      setDocKey(result.key)
    } else {
      setError(result.error)
    }
    setIsUploading(false)
  }

  function handleSubmit() {
    setError(null)

    if (!form.title.trim()) {
      setError('Judul wajib diisi')
      return
    }

    if (requestVerif && !verifierId) {
      setError('Pilih lembaga verifikasi')
      return
    }

    startTransition(async () => {
      if (existing) {
        const result = await updateCertificate({
          id: existing.id,
          title: form.title.trim(),
          certificateNumber: form.certificateNumber.trim() || undefined,
          issuedDate: form.issuedDate || undefined,
          expiredDate: form.expiredDate || undefined,
          badgeType: form.badgeType,
          documentUrl: docUrl || undefined,
          documentKey: docKey || undefined,
        })

        if (result.ok) {
          router.refresh()
          onClose()
        } else {
          setError(result.error || 'Gagal menyimpan')
        }
      } else {
        const result = await addCertificate({
          title: form.title.trim(),
          certificateNumber: form.certificateNumber.trim() || undefined,
          issuedDate: form.issuedDate || undefined,
          expiredDate: form.expiredDate || undefined,
          badgeType: form.badgeType,
          documentUrl: docUrl || undefined,
          documentKey: docKey || undefined,
          institutionId: verifierId || undefined,
          requestVerification: requestVerif,
        })

        if (result.ok) {
          router.refresh()
          onClose()
        } else {
          setError(result.error || 'Gagal menyimpan')
        }
      }
    })
  }

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={() => !isPending && onClose()}
    >
      <div
        className="w-full max-w-lg bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/30 overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-outline-variant/30 shrink-0">
          <h2 className="text-base font-black text-on-surface">
            {existing ? 'Edit Sertifikat' : 'Tambah Sertifikat'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          {error && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-sm">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
              Judul Sertifikat *
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Junior Web Developer"
              className="w-full px-3 py-2 rounded-lg border border-outline-variant/30 bg-surface-container-lowest text-sm focus:outline-none focus:border-primary/50"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
              Jenis Sertifikat
            </label>
            <div className="grid grid-cols-3 gap-2">
              {BADGE_TYPES.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setForm({ ...form, badgeType: opt.value })}
                  className={`p-2.5 rounded-lg border text-xs font-bold transition-colors ${
                    form.badgeType === opt.value
                      ? 'bg-primary/10 border-primary/30 text-primary'
                      : 'border-outline-variant/30 text-on-surface hover:bg-surface-container'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                Tanggal Terbit
              </label>
              <input
                type="date"
                value={form.issuedDate}
                onChange={(e) =>
                  setForm({ ...form, issuedDate: e.target.value })
                }
                className="w-full px-3 py-2 rounded-lg border border-outline-variant/30 bg-surface-container-lowest text-sm focus:outline-none focus:border-primary/50"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                Kadaluarsa
              </label>
              <input
                type="date"
                value={form.expiredDate}
                onChange={(e) =>
                  setForm({ ...form, expiredDate: e.target.value })
                }
                className="w-full px-3 py-2 rounded-lg border border-outline-variant/30 bg-surface-container-lowest text-sm focus:outline-none focus:border-primary/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
              No. Sertifikat
            </label>
            <input
              type="text"
              value={form.certificateNumber}
              onChange={(e) =>
                setForm({ ...form, certificateNumber: e.target.value })
              }
              placeholder="No. 1234/BNSP/2026"
              className="w-full px-3 py-2 rounded-lg border border-outline-variant/30 bg-surface-container-lowest text-sm focus:outline-none focus:border-primary/50"
            />
          </div>

          {/* Upload Bukti */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
              Gambar Sertifikat
            </label>

            {docUrl ? (
              <div className="relative rounded-lg overflow-hidden bg-surface-container aspect-[4/3] group">
                <img
                  src={docUrl}
                  alt="Sertifikat"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setDocUrl('')
                    setDocKey('')
                  }}
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-rose-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="w-full p-6 rounded-xl bg-surface-container-low border border-dashed border-outline-variant/40 text-center hover:border-primary/40 transition-colors disabled:opacity-60"
              >
                {isUploading ? (
                  <Loader2 className="w-6 h-6 text-primary animate-spin mx-auto mb-2" />
                ) : (
                  <FileCheck className="w-6 h-6 text-on-surface-variant mx-auto mb-2" />
                )}
                <p className="text-xs font-bold text-on-surface">
                  {isUploading ? 'Uploading...' : 'Upload Gambar Sertifikat'}
                </p>
                <p className="text-[10px] text-on-surface-variant mt-1">
                  PNG, JPG — max 5MB
                </p>
              </button>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleUpload}
              className="hidden"
            />
          </div>

          {/* Verifikasi */}
          {!existing && (
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/15 space-y-3">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={requestVerif}
                  onChange={(e) => setRequestVerif(e.target.checked)}
                  className="mt-0.5 w-4 h-4 accent-primary"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-primary" />
                    <span className="text-sm font-bold text-on-surface">
                      Minta Verifikasi
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    Dapatkan digital badge terverifikasi. Tanpa ini, sertifikat
                    dianggap "self-uploaded".
                  </p>
                </div>
              </label>

              {requestVerif && (
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                    Pilih Lembaga Verifikasi
                  </label>
                  <select
                    value={verifierId}
                    onChange={(e) => setVerifierId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-outline-variant/30 bg-surface-container-lowest text-sm focus:outline-none focus:border-primary/50"
                  >
                    <option value="">Pilih lembaga...</option>
                    {verifiers.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name} ({v.type})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 px-5 py-4 border-t border-outline-variant/30 shrink-0">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isPending || isUploading || !form.title.trim()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-bold hover:bg-primary/90 disabled:opacity-60"
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            {existing ? 'Simpan' : 'Tambah'}
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="px-4 py-2 rounded-lg text-sm font-bold text-on-surface-variant hover:bg-surface-container"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  )
}