import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from 'lucide-react'
import { getVerificationById } from '@/lib/admin/queries'
import { VerificationDetail } from '@/components/admin/verifications/verification-detail'
import { VerificationActions } from '@/components/admin/verifications/verification-actions'

type Params = Promise<{ id: string }>

export default async function VerificationDetailPage({
  params,
}: {
  params: Params
}) {
  const { id } = await params
  const verification = await getVerificationById(id)

  if (!verification) notFound()

  const statusConfig = {
    pending: {
      icon: Clock,
      label: 'Menunggu Review',
      color: 'bg-amber-100 text-amber-700 border-amber-200',
    },
    approved: {
      icon: CheckCircle2,
      label: 'Disetujui',
      color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    },
    rejected: {
      icon: XCircle,
      label: 'Ditolak',
      color: 'bg-red-100 text-red-700 border-red-200',
    },
  }[verification.status] || {
    icon: AlertCircle,
    label: verification.status,
    color: 'bg-gray-100 text-gray-700 border-gray-200',
  }

  const StatusIcon = statusConfig.icon

  return (
    <div className="space-y-6">
      {/* Back */}
      <Link
        href="/admin/verifications"
        className="inline-flex items-center gap-2 text-sm text-on-surface-variant hover:text-primary transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali ke Verifikasi
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-on-surface">
            Detail Verifikasi
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Review data & dokumen perusahaan sebelum menyetujui
          </p>
        </div>

        <span
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border font-mono text-[11px] font-bold uppercase tracking-wider ${statusConfig.color}`}
        >
          <StatusIcon className="w-3.5 h-3.5" />
          {statusConfig.label}
        </span>
      </div>

      {/* Content — 2 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <VerificationDetail verification={verification} />
        </div>

        <div className="lg:col-span-4">
          <VerificationActions
            verificationId={verification.id}
            status={verification.status}
            companyName={verification.company.name}
          />
        </div>
      </div>
    </div>
  )
}