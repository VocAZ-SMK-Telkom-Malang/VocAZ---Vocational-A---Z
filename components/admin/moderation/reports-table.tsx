'use client'

import Link from 'next/link'
import {
  Eye,
  Flag,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  User,
  Video,
  Briefcase,
  Building2,
  Image,
} from 'lucide-react'

type Report = {
  id: string
  contentType: string
  contentId: string
  reason: string | null
  description: string | null
  status: string
  createdAt: Date
  reporter: {
    id: string
    fullName: string | null
    email: string
    role: string
  } | null
}

type Props = {
  reports: Report[]
}

const CONTENT_TYPE_CONFIG: Record<
  string,
  { label: string; icon: any; color: string }
> = {
  showcase_video: {
    label: 'Video Showcase',
    icon: Video,
    color: 'bg-pink-100 text-pink-700',
  },
  portfolio: {
    label: 'Portofolio',
    icon: Image,
    color: 'bg-blue-100 text-blue-700',
  },
  profile: {
    label: 'Profil',
    icon: User,
    color: 'bg-purple-100 text-purple-700',
  },
  company: {
    label: 'Perusahaan',
    icon: Building2,
    color: 'bg-emerald-100 text-emerald-700',
  },
  job: {
    label: 'Lowongan',
    icon: Briefcase,
    color: 'bg-amber-100 text-amber-700',
  },
}

export function ReportsTable({ reports }: Props) {
  if (reports.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-outline-variant/30 py-16 text-center">
        <Flag className="w-12 h-12 text-on-surface-variant/40 mx-auto mb-3" />
        <p className="text-on-surface-variant text-sm">
          Tidak ada laporan ditemukan.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {reports.map((report) => (
        <ReportRow key={report.id} report={report} />
      ))}
    </div>
  )
}

function ReportRow({ report }: { report: Report }) {
  const typeConfig = CONTENT_TYPE_CONFIG[report.contentType] || {
    label: report.contentType,
    icon: Flag,
    color: 'bg-gray-100 text-gray-700',
  }
  const TypeIcon = typeConfig.icon

  const statusConfig = {
    pending: {
      icon: Clock,
      label: 'Menunggu',
      color: 'bg-amber-100 text-amber-700',
    },
    reviewed: {
      icon: AlertCircle,
      label: 'Direview',
      color: 'bg-blue-100 text-blue-700',
    },
    resolved: {
      icon: CheckCircle2,
      label: 'Diselesaikan',
      color: 'bg-emerald-100 text-emerald-700',
    },
    dismissed: {
      icon: XCircle,
      label: 'Diabaikan',
      color: 'bg-gray-200 text-gray-700',
    },
  }[report.status] || {
    icon: AlertCircle,
    label: report.status,
    color: 'bg-gray-100 text-gray-700',
  }

  const StatusIcon = statusConfig.icon

  return (
    <div className="bg-white rounded-2xl border border-outline-variant/30 p-5 hover:border-primary/30 hover:shadow-[0_8px_24px_rgba(183,0,17,0.06)] transition-all">
      <div className="flex items-start gap-4">
        {/* Content type icon */}
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${typeConfig.color}`}
        >
          <TypeIcon className="w-5 h-5" />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="min-w-0">
              <h3 className="font-display text-base font-bold text-on-surface">
                {typeConfig.label}
              </h3>
              <p className="text-xs text-on-surface-variant">
                Dilaporkan oleh{' '}
                {report.reporter?.fullName || 'Anonim'} (
                {report.reporter?.email || '-'})
              </p>
            </div>

            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-mono text-[10px] font-bold uppercase tracking-wider shrink-0 ${statusConfig.color}`}
            >
              <StatusIcon className="w-3 h-3" />
              {statusConfig.label}
            </span>
          </div>

          {/* Reason */}
          <div className="mb-3">
            <span className="inline-block px-2 py-0.5 rounded-md bg-red-50 text-red-700 font-mono text-[10px] font-bold uppercase tracking-wider mb-1">
              {report.reason || 'Tanpa alasan'}
            </span>
            {report.description && (
              <p className="text-xs text-on-surface-variant line-clamp-2 mt-1">
                {report.description}
              </p>
            )}
          </div>

          {/* Action */}
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-on-surface-variant">
              {new Date(report.createdAt).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </span>

            <Link
              href={`/admin/moderation/${report.id}`}
              className="inline-flex items-center gap-1.5 bg-gradient-to-r from-primary-container to-[#E03E3E] text-white font-display text-xs font-semibold px-4 py-2 rounded-full shadow-sm hover:brightness-105 active:scale-95 transition-all"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Review</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}