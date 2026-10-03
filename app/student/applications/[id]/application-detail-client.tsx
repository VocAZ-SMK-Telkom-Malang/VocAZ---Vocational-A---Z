// app/student/applications/[id]/application-detail-client.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Building2,
  MapPin,
  Clock,
  Calendar,
  User,
  FileText,
  Download,
  AlertCircle,
  CheckCircle2,
  BadgeCheck,
} from 'lucide-react'
import { withdrawApplicationAction } from '@/app/student/jobs/actions'

type Props = {
  application: any  // dari getMyApplicationDetail
}

const STATUS_LABEL: Record<string, { label: string; style: string }> = {
  submitted: { label: 'Lamaran Terkirim', style: 'bg-blue-50 text-blue-700 border-blue-200' },
  reviewed: { label: 'Sedang Ditinjau', style: 'bg-amber-50 text-amber-700 border-amber-200' },
  shortlisted: { label: 'Shortlist', style: 'bg-purple-50 text-purple-700 border-purple-200' },
  interview: { label: 'Tahap Interview', style: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  offered: { label: 'Ditawari Kontrak', style: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  hired: { label: 'Diterima', style: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  rejected: { label: 'Tidak Lolos', style: 'bg-error/10 text-error border-error/20' },
  withdrawn: { label: 'Dicabut', style: 'bg-surface-container text-on-surface-variant border-outline-variant' },
}

export function ApplicationDetailClient({ application }: Props) {
  const router = useRouter()
  const [withdrawing, setWithdrawing] = useState(false)

  const statusCfg = STATUS_LABEL[application.status] ?? STATUS_LABEL.submitted
  const canWithdraw = !['hired', 'withdrawn', 'rejected'].includes(
    application.status
  )

  async function handleWithdraw() {
    if (
      !confirm(
        'Yakin mau menarik lamaran ini? Tindakan ini tidak bisa dibatalkan.'
      )
    ) {
      return
    }
    setWithdrawing(true)
    const res = await withdrawApplicationAction(application.id)
    setWithdrawing(false)
    if (res.success) {
      router.refresh()
    } else {
      alert(res.error ?? 'Gagal menarik lamaran')
    }
  }

  return (
    <div className="max-w-[1000px] mx-auto flex flex-col gap-6">
      {/* Back */}
      <Link
        href="/student/applications"
        className="inline-flex items-center gap-2 text-sm font-medium text-on-surface-variant hover:text-primary transition-colors w-fit"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali ke daftar lamaran
      </Link>

      {/* Header */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6">
        <div className="flex items-start gap-4">
          {application.job.company.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={application.job.company.logoUrl}
              alt={application.job.company.name}
              className="w-14 h-14 rounded-xl object-cover shrink-0"
            />
          ) : (
            <div className="w-14 h-14 rounded-xl bg-primary text-white flex items-center justify-center font-black text-xl shrink-0">
              {application.job.company.name.charAt(0)}
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full border font-mono text-[11px] font-bold ${statusCfg.style}`}
              >
                {statusCfg.label}
              </span>
            </div>

            <h1 className="text-xl font-black text-on-surface truncate">
              {application.job.title}
            </h1>

            <Link
              href={`/perusahaan/${application.job.company.slug}`}
              className="inline-flex items-center gap-1.5 mt-1 text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors"
            >
              <Building2 className="w-4 h-4" />
              {application.job.company.name}
              {application.job.company.verificationStatus === 'verified' && (
                <BadgeCheck className="w-4 h-4 text-primary" />
              )}
            </Link>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-on-surface-variant">
              {application.job.city && (
                <span className="inline-flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {application.job.city}
                </span>
              )}
              <span className="inline-flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                Dilamar{' '}
                {new Date(application.appliedAt).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </div>
          </div>
        </div>

        {canWithdraw && (
          <div className="mt-4 pt-4 border-t border-outline-variant/30 flex justify-end">
            <button
              type="button"
              onClick={handleWithdraw}
              disabled={withdrawing}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-error/5 text-error text-xs font-bold hover:bg-error/10 transition-colors disabled:opacity-50"
            >
              <AlertCircle className="w-3.5 h-3.5" />
              {withdrawing ? 'Memproses...' : 'Tarik Lamaran'}
            </button>
          </div>
        )}
      </div>

      {/* Interview info */}
      {application.interviewDate && (
        <div className="bg-indigo-50 rounded-2xl border border-indigo-200 p-5 flex items-start gap-3">
          <Calendar className="w-5 h-5 text-indigo-700 shrink-0 mt-0.5" />
          <div>
            <div className="text-sm font-bold text-indigo-900">
              Interview Dijadwalkan
            </div>
            <div className="text-xs text-indigo-700 mt-0.5">
              {new Date(application.interviewDate).toLocaleString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
              {application.recruiterName &&
                ` · dengan ${application.recruiterName}`}
            </div>
            {application.nextStep && (
              <div className="text-xs text-indigo-700 mt-1">
                Next: {application.nextStep}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6">
        <h2 className="text-sm font-bold text-on-surface mb-5">
          Timeline Lamaran
        </h2>
        <div className="flex flex-col gap-4">
          {application.history.map((h: any, idx: number) => {
            const cfg =
              STATUS_LABEL[h.status] ?? STATUS_LABEL.submitted
            const isLast = idx === application.history.length - 1
            return (
              <div key={h.id} className="flex gap-3">
                <div className="flex flex-col items-center shrink-0">
                  <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                  </div>
                  {!isLast && (
                    <div className="flex-1 w-px bg-outline-variant/40 my-1" />
                  )}
                </div>
                <div className="flex-1 pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="font-bold text-sm text-on-surface">
                      {cfg.label}
                    </div>
                    <div className="text-[10px] text-on-surface-variant whitespace-nowrap font-mono">
                      {new Date(h.createdAt).toLocaleString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                  {h.notes && (
                    <p className="text-xs text-on-surface-variant mt-0.5">
                      {h.notes}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Cover Letter */}
      {application.coverLetter && (
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6">
          <h2 className="text-sm font-bold text-on-surface mb-3 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Surat Lamaran
          </h2>
          <p className="text-sm text-on-surface whitespace-pre-line leading-relaxed">
            {application.coverLetter}
          </p>
        </div>
      )}

      {/* CV */}
      {application.resumeUrl && (
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6">
          <h2 className="text-sm font-bold text-on-surface mb-3">
            CV yang Dikirim
          </h2>
          <a
            href={application.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-primary text-white text-sm font-bold hover:bg-primary-container transition-colors"
          >
            <Download className="w-4 h-4" />
            Download CV
          </a>
        </div>
      )}
    </div>
  )
}