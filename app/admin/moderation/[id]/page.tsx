// app/admin/moderation/[id]/page.tsx
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft,
  Flag,
  User,
  Calendar,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock,
} from 'lucide-react'
import { getContentReportById } from '@/lib/admin/queries'
import { AdminCard, AdminCardHeader } from '@/components/admin/ui/admin-card'
import { ReportActions } from '@/components/admin/moderation/report-actions'

type Params = Promise<{ id: string }>

// ============================================
// STATUS CONFIG (semua enum ReportStatus)
// ============================================

const STATUS_CONFIG: Record<
  string,
  {
    icon: React.ComponentType<{ className?: string }>
    label: string
    color: string
  }
> = {
  pending: {
    icon: Clock,
    label: 'Menunggu Review',
    color: 'bg-amber-100 text-amber-700 border-amber-200',
  },
  reviewed: {
    icon: AlertCircle,
    label: 'Sedang Ditinjau',
    color: 'bg-blue-100 text-blue-700 border-blue-200',
  },
  resolved: {
    icon: CheckCircle2,
    label: 'Diselesaikan',
    color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  },
  dismissed: {
    icon: XCircle,
    label: 'Diabaikan',
    color: 'bg-gray-100 text-gray-700 border-gray-200',
  },
}

const FALLBACK_CONFIG = {
  icon: AlertCircle,
  label: 'Status Tidak Diketahui',
  color: 'bg-gray-100 text-gray-700 border-gray-200',
}

export default async function ModerationDetailPage({
  params,
}: {
  params: Params
}) {
  const { id } = await params
  const report = await getContentReportById(id)

  if (!report) notFound()

  const statusConfig = STATUS_CONFIG[report.status] || {
    ...FALLBACK_CONFIG,
    label: report.status,
  }

  const StatusIcon = statusConfig.icon

  return (
    <div className="space-y-6">
      {/* Back */}
      <Link
        href="/admin/moderation"
        className="inline-flex items-center gap-2 text-sm text-on-surface-variant hover:text-primary transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali ke Moderasi
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-on-surface">
            Detail Laporan
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Review laporan dan tentukan tindakan
          </p>
        </div>

        <span
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border font-mono text-[11px] font-bold uppercase tracking-wider ${statusConfig.color}`}
        >
          <StatusIcon className="w-3.5 h-3.5" />
          {statusConfig.label}
        </span>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          {/* Report info */}
          <AdminCard>
            <AdminCardHeader title="Informasi Laporan" />
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
              <InfoRow
                icon={Flag}
                label="Jenis Konten"
                value={report.contentType}
              />
              <InfoRow
                icon={Calendar}
                label="Tanggal Dilaporkan"
                value={new Date(report.createdAt).toLocaleString('id-ID')}
              />
              <InfoRow
                icon={AlertCircle}
                label="Alasan"
                value={report.reason || 'Tidak disebutkan'}
                fullWidth
              />
              <InfoRow
                icon={User}
                label="Pelapor"
                value={
                  report.reporter
                    ? `${report.reporter.fullName || 'Anonim'} (${report.reporter.email})`
                    : 'Anonim'
                }
                fullWidth
              />
            </dl>

            {report.description && (
              <div className="mt-6 pt-6 border-t border-outline-variant/30">
                <h4 className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">
                  Deskripsi Laporan
                </h4>
                <p className="text-sm text-on-surface leading-relaxed">
                  {report.description}
                </p>
              </div>
            )}
          </AdminCard>

          {/* Reported Content Preview */}
          <AdminCard>
            <AdminCardHeader
              title="Konten yang Dilaporkan"
              description="Preview konten yang dilaporkan"
            />
            {report.reportedContent ? (
              <pre className="text-xs bg-surface-container-low p-4 rounded-xl overflow-x-auto">
                {JSON.stringify(report.reportedContent, null, 2)}
              </pre>
            ) : (
              <p className="text-sm text-on-surface-variant py-4">
                Konten tidak ditemukan (mungkin sudah dihapus).
              </p>
            )}
          </AdminCard>

          {/* Resolution */}
          {report.resolutionNote && (
            <AdminCard>
              <AdminCardHeader title="Catatan Resolusi" />
              <p className="text-sm text-on-surface leading-relaxed">
                {report.resolutionNote}
              </p>
              {report.reviewedAt && (
                <p className="text-xs text-on-surface-variant mt-2">
                  Direview pada{' '}
                  {new Date(report.reviewedAt).toLocaleString('id-ID')}
                </p>
              )}
            </AdminCard>
          )}
        </div>

        <div className="lg:col-span-4">
          <ReportActions reportId={report.id} status={report.status} />
        </div>
      </div>
    </div>
  )
}

function InfoRow({
  icon: Icon,
  label,
  value,
  fullWidth,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  fullWidth?: boolean
}) {
  return (
    <div className={fullWidth ? 'sm:col-span-2' : ''}>
      <dt className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
        <Icon className="w-3.5 h-3.5" />
        {label}
      </dt>
      <dd className="text-sm text-on-surface leading-relaxed break-words">
        {value}
      </dd>
    </div>
  )
}