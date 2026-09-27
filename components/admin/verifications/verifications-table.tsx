'use client'

import Link from 'next/link'
import {
  Eye,
  Building2,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from 'lucide-react'
import { AdminBadge } from '@/components/admin/ui/admin-badge'

type Verification = {
  id: string
  status: string
  submittedAt: Date
  reviewedAt: Date | null
  company: {
    id: string
    name: string
    slug: string
    industry: string | null
    city: string | null
    province: string | null
    logoUrl: string | null
    verificationStatus: string
  }
}

type Props = {
  verifications: Verification[]
}

export function VerificationsTable({ verifications }: Props) {
  if (verifications.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-outline-variant/30 py-16 text-center">
        <Building2 className="w-12 h-12 text-on-surface-variant/40 mx-auto mb-3" />
        <p className="text-on-surface-variant text-sm">
          Tidak ada verifikasi ditemukan.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {verifications.map((v) => (
        <VerificationRow key={v.id} verification={v} />
      ))}
    </div>
  )
}

function VerificationRow({ verification }: { verification: Verification }) {
  const statusConfig = {
    pending: {
      icon: Clock,
      label: 'Menunggu Review',
      color: 'bg-amber-100 text-amber-700',
    },
    approved: {
      icon: CheckCircle2,
      label: 'Disetujui',
      color: 'bg-emerald-100 text-emerald-700',
    },
    rejected: {
      icon: XCircle,
      label: 'Ditolak',
      color: 'bg-red-100 text-red-700',
    },
  }[verification.status] || {
    icon: AlertCircle,
    label: verification.status,
    color: 'bg-gray-100 text-gray-700',
  }

  const StatusIcon = statusConfig.icon

  return (
    <div className="bg-white rounded-2xl border border-outline-variant/30 p-5 hover:border-primary/30 hover:shadow-[0_8px_24px_rgba(183,0,17,0.06)] transition-all">
      <div className="flex items-start gap-4">
        {/* Company logo */}
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-fixed to-tertiary-fixed flex items-center justify-center shrink-0 overflow-hidden">
          {verification.company.logoUrl ? (
            <img
              src={verification.company.logoUrl}
              alt={verification.company.name}
              className="w-full h-full object-contain bg-white"
            />
          ) : (
            <Building2 className="w-6 h-6 text-primary" />
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="min-w-0">
              <h3 className="font-display text-base font-bold text-on-surface truncate">
                {verification.company.name}
              </h3>
              <p className="text-xs text-on-surface-variant">
                {verification.company.industry || 'Industri belum diisi'}
              </p>
            </div>

            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-mono text-[10px] font-bold uppercase tracking-wider shrink-0 ${statusConfig.color}`}
            >
              <StatusIcon className="w-3 h-3" />
              {statusConfig.label}
            </span>
          </div>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-on-surface-variant mb-3">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {verification.company.city && verification.company.province
                ? `${verification.company.city}, ${verification.company.province}`
                : 'Lokasi belum diisi'}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              Didaftar{' '}
              {new Date(verification.submittedAt).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </span>
          </div>

          {/* Action */}
          <div className="flex items-center justify-end">
            <Link
              href={`/admin/verifications/${verification.id}`}
              className="inline-flex items-center gap-1.5 bg-gradient-to-r from-primary-container to-[#E03E3E] text-white font-display text-xs font-semibold px-4 py-2 rounded-full shadow-sm hover:brightness-105 active:scale-95 transition-all"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Lihat Detail</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}