// components/student/profile/profile-certifications-summary.tsx
'use client'

import Link from 'next/link'
import {
  FileCheck,
  ArrowUpRight,
  BadgeCheck,
  Clock,
  XCircle,
  ExternalLink,
} from 'lucide-react'

type Certificate = {
  id: string
  title: string
  certificateNumber: string | null
  issuedDate: string | null
  expiredDate: string | null
  documentUrl: string | null
  badgeType: string
  verificationStatus: string
  institutionName: string | null
  institutionType: string | null
}

type Props = {
  certificates: Certificate[]
  preview?: boolean
}

const STATUS_CONFIG: Record<
  string,
  { label: string; bg: string; color: string; icon: React.ReactNode }
> = {
  verified: {
    label: 'Terverifikasi',
    bg: 'bg-emerald-50',
    color: 'text-emerald-700',
    icon: <BadgeCheck className="w-3 h-3" />,
  },
  pending: {
    label: 'Menunggu Verifikasi',
    bg: 'bg-amber-50',
    color: 'text-amber-700',
    icon: <Clock className="w-3 h-3" />,
  },
  rejected: {
    label: 'Ditolak',
    bg: 'bg-rose-50',
    color: 'text-rose-700',
    icon: <XCircle className="w-3 h-3" />,
  },
}

export function ProfileCertificationsSummary({
  certificates,
  preview = false,
}: Props) {
  const display = preview ? certificates.slice(0, 4) : certificates

  if (certificates.length === 0) {
    return (
      <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant/30 p-8 text-center">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3">
          <FileCheck className="w-6 h-6" />
        </div>
        <p className="text-sm font-bold text-on-surface mb-1">
          Belum ada sertifikat
        </p>
        <p className="text-xs text-on-surface-variant mb-4">
          Upload sertifikat biar profile kamu makin dipercaya
        </p>
        <Link
          href="/student/profile/certifications"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-bold hover:bg-primary/90"
        >
          <FileCheck className="w-4 h-4" />
          Upload Sertifikat
        </Link>
      </div>
    )
  }

  return (
    <section className="rounded-2xl bg-surface-container-lowest border border-outline-variant/30 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <FileCheck className="w-4 h-4" />
          </div>
          <h2 className="text-base font-black text-on-surface">
            Sertifikat{' '}
            <span className="text-on-surface-variant font-bold">
              ({certificates.length})
            </span>
          </h2>
        </div>
        <Link
          href="/student/profile/certifications"
          className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline underline-offset-4"
        >
          Kelola
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="space-y-2.5">
        {display.map((cert) => {
          const cfg =
            STATUS_CONFIG[cert.verificationStatus] ?? STATUS_CONFIG.pending
          return (
            <div
              key={cert.id}
              className="flex items-start gap-3 p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/20 hover:border-primary/30 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <FileCheck className="w-5 h-5" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-on-surface line-clamp-1">
                  {cert.title}
                </p>
                {cert.institutionName && (
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    {cert.institutionName}
                  </p>
                )}
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${cfg.bg} ${cfg.color}`}
                  >
                    {cfg.icon}
                    {cfg.label}
                  </span>
                  {cert.issuedDate && (
                    <span className="text-[10px] text-on-surface-variant">
                      {new Date(cert.issuedDate).toLocaleDateString('id-ID', {
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  )}
                </div>
              </div>

              {cert.documentUrl && (
                <a
                  href={cert.documentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors shrink-0"
                  aria-label="Lihat sertifikat"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          )
        })}
      </div>

      {preview && certificates.length > 4 && (
        <Link
          href="/student/profile/certifications"
          className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline underline-offset-4"
        >
          Lihat semua {certificates.length} sertifikat
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      )}
    </section>
  )
}