// components/student/talents/modals/certificate-modal.tsx
'use client'

import { useEffect } from 'react'
import {
  X,
  FileCheck,
  Calendar,
  BadgeCheck,
  ExternalLink,
  Building2,
  Hash,
} from 'lucide-react'

type Certificate = {
  id: string
  title: string
  issuedDate: string | null
  documentUrl: string | null
  badgeType: string
  verificationStatus: string
  institutionName: string | null
  certificateNumber?: string | null
  expiredDate?: string | null
}

type Props = {
  certificate: Certificate
  onClose: () => void
}

const BADGE_LABEL: Record<string, string> = {
  lsp_bnsp: 'LSP / BNSP',
  industry: 'Industri',
  training: 'Pelatihan',
}

export function CertificateModal({ certificate, onClose }: Props) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  const isVerified = certificate.verificationStatus === 'verified'

  return (
    <div
      className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/30 overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-6 py-4 border-b border-outline-variant/30 shrink-0">
          <div className="flex items-start gap-3 min-w-0">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                isVerified
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-amber-100 text-amber-700'
              }`}
            >
              <FileCheck className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="font-mono text-[10px] uppercase tracking-widest font-bold text-primary mb-0.5">
                Sertifikat
              </p>
              <h2 className="text-base font-black text-on-surface line-clamp-2">
                {certificate.title}
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors shrink-0"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {/* Gambar sertifikat */}
          {certificate.documentUrl && (
            <div className="aspect-[4/3] bg-surface-container">
              <img
                src={certificate.documentUrl}
                alt={certificate.title}
                className="w-full h-full object-contain"
              />
            </div>
          )}

          <div className="p-6 space-y-5">
            {/* Verified badge */}
            {isVerified && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                <BadgeCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <p className="text-sm font-bold text-emerald-700">
                    Sertifikat Terverifikasi
                  </p>
                  <p className="text-xs text-emerald-600/80">
                    Diverifikasi oleh lembaga resmi
                  </p>
                </div>
              </div>
            )}

            {/* Info grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {certificate.institutionName && (
                <div>
                  <h3 className="font-mono text-[10px] uppercase tracking-wider font-bold text-on-surface-variant mb-1.5">
                    Lembaga Penerbit
                  </h3>
                  <p className="inline-flex items-center gap-1.5 text-sm font-bold text-on-surface">
                    <Building2 className="w-3.5 h-3.5 text-on-surface-variant" />
                    {certificate.institutionName}
                  </p>
                </div>
              )}

              <div>
                <h3 className="font-mono text-[10px] uppercase tracking-wider font-bold text-on-surface-variant mb-1.5">
                  Jenis
                </h3>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-primary/5 text-primary text-xs font-bold">
                  {BADGE_LABEL[certificate.badgeType] ?? certificate.badgeType}
                </span>
              </div>

              {certificate.issuedDate && (
                <div>
                  <h3 className="font-mono text-[10px] uppercase tracking-wider font-bold text-on-surface-variant mb-1.5">
                    Tanggal Terbit
                  </h3>
                  <p className="inline-flex items-center gap-1.5 text-sm text-on-surface">
                    <Calendar className="w-3.5 h-3.5 text-on-surface-variant" />
                    {new Date(certificate.issuedDate).toLocaleDateString(
                      'id-ID',
                      {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      }
                    )}
                  </p>
                </div>
              )}

              {certificate.expiredDate && (
                <div>
                  <h3 className="font-mono text-[10px] uppercase tracking-wider font-bold text-on-surface-variant mb-1.5">
                    Berlaku Hingga
                  </h3>
                  <p className="inline-flex items-center gap-1.5 text-sm text-on-surface">
                    <Calendar className="w-3.5 h-3.5 text-on-surface-variant" />
                    {new Date(certificate.expiredDate).toLocaleDateString(
                      'id-ID',
                      {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      }
                    )}
                  </p>
                </div>
              )}

              {certificate.certificateNumber && (
                <div className="sm:col-span-2">
                  <h3 className="font-mono text-[10px] uppercase tracking-wider font-bold text-on-surface-variant mb-1.5">
                    Nomor Sertifikat
                  </h3>
                  <p className="inline-flex items-center gap-1.5 text-sm font-mono text-on-surface">
                    <Hash className="w-3.5 h-3.5 text-on-surface-variant" />
                    {certificate.certificateNumber}
                  </p>
                </div>
              )}
            </div>

            {/* Link ke dokumen */}
            {certificate.documentUrl && (
              <div className="pt-4 border-t border-outline-variant/20">
                <a
                  href={certificate.documentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:underline"
                >
                  Lihat Dokumen Asli
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}