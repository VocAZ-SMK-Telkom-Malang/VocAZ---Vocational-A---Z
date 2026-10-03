// components/company/verification/verification-status-banner.tsx
'use client'

import {
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react'

type Props = {
  status: 'unverified' | 'pending' | 'in_review' | 'verified' | 'rejected'
  reviewNotes?: string | null
  verifiedAt?: string | null
}

const STATUS_CONFIG = {
  unverified: {
    icon: AlertCircle,
    bg: 'bg-surface-container',
    border: 'border-outline-variant',
    iconBg: 'bg-surface-container-high text-on-surface-variant',
    title: 'Belum Terverifikasi',
    desc: 'Ajukan verifikasi untuk mendapatkan badge Verified.',
    color: 'text-on-surface-variant',
  },
  pending: {
    icon: Clock,
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    iconBg: 'bg-amber-100 text-amber-700',
    title: 'Menunggu Review',
    desc: 'Pengajuan kamu sedang dalam antrean review admin.',
    color: 'text-amber-800',
  },
  in_review: {
    icon: Clock,
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    iconBg: 'bg-blue-100 text-blue-700',
    title: 'Sedang Ditinjau',
    desc: 'Admin sedang memeriksa dokumen yang kamu kirim.',
    color: 'text-blue-800',
  },
  verified: {
    icon: CheckCircle2,
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    iconBg: 'bg-emerald-100 text-emerald-700',
    title: 'Terverifikasi',
    desc: 'Perusahaan kamu sudah terverifikasi. Badge muncul di seluruh platform.',
    color: 'text-emerald-800',
  },
  rejected: {
    icon: XCircle,
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    iconBg: 'bg-rose-100 text-rose-700',
    title: 'Pengajuan Ditolak',
    desc: 'Cek catatan reviewer di bawah dan ajukan ulang.',
    color: 'text-rose-800',
  },
}

export function VerificationStatusBanner({
  status,
  reviewNotes,
  verifiedAt,
}: Props) {
  const config = STATUS_CONFIG[status]
  const Icon = config.icon

  return (
    <div
      className={`rounded-2xl border-2 ${config.bg} ${config.border} p-5 lg:p-6`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`w-12 h-12 rounded-xl ${config.iconBg} flex items-center justify-center shrink-0`}
        >
          <Icon className="w-6 h-6" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className={`text-base font-black ${config.color}`}>
              {config.title}
            </h3>
            {status === 'verified' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500 text-white font-mono text-[10px] font-bold uppercase tracking-wider">
                <ShieldCheck className="w-3 h-3" />
                Verified Company
              </span>
            )}
          </div>

          <p className={`text-sm ${config.color} opacity-90`}>{config.desc}</p>

          {status === 'verified' && verifiedAt && (
            <p className="text-xs text-emerald-700 mt-2 font-mono">
              Terverifikasi:{' '}
              {new Date(verifiedAt).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          )}

          {status === 'rejected' && reviewNotes && (
            <div className="mt-3 p-3 rounded-lg bg-white border border-rose-200">
              <div className="font-mono text-[10px] uppercase tracking-wider font-bold text-rose-700 mb-1">
                Catatan Reviewer
              </div>
              <p className="text-sm text-rose-800">{reviewNotes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}