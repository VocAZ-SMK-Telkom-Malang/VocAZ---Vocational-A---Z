// components/student/applications/application-card.tsx
'use client'

import Link from 'next/link'
import {
  Building2,
  MapPin,
  Clock,
  BadgeCheck,
  Zap,
  ChevronRight,
  Calendar,
} from 'lucide-react'
import type { MyApplication } from '@/lib/queries/student-jobs'

const STATUS_LABEL: Record<string, { label: string; style: string }> = {
  submitted: { label: 'Lamaran Terkirim', style: 'bg-blue-50 text-blue-700 border-blue-200' },
  reviewed: { label: 'Sedang Ditinjau', style: 'bg-amber-50 text-amber-700 border-amber-200' },
  shortlisted: { label: 'Shortlist', style: 'bg-purple-50 text-purple-700 border-purple-200' },
  interview: { label: 'Interview', style: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  offered: { label: 'Ditawari', style: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  hired: { label: 'Diterima', style: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  rejected: { label: 'Tidak Lolos', style: 'bg-error/10 text-error border-error/20' },
  withdrawn: { label: 'Dicabut', style: 'bg-surface-container text-on-surface-variant border-outline-variant' },
}

const EMPLOYMENT_LABEL: Record<string, string> = {
  internship: 'Internship',
  part_time: 'Part Time',
  full_time: 'Full Time',
  freelance: 'Freelance',
  volunteer: 'Volunteer',
  contract: 'Contract',
}

export function ApplicationCard({ application }: { application: MyApplication }) {
  const statusCfg = STATUS_LABEL[application.status] ?? STATUS_LABEL.submitted

  return (
    <Link
      href={`/student/applications/${application.id}`}
      className="group bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-5 hover:border-primary/30 hover:shadow-md transition-all"
    >
      <div className="flex items-start gap-4">
        {application.job.companyLogo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={application.job.companyLogo}
            alt={application.job.companyName}
            className="w-12 h-12 rounded-xl object-cover shrink-0"
          />
        ) : (
          <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center font-bold shrink-0">
            {application.job.companyName.charAt(0)}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-base font-bold text-on-surface group-hover:text-primary transition-colors truncate">
              {application.job.title}
            </h3>
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-md border font-mono text-[10px] font-bold ${statusCfg.style}`}
            >
              {statusCfg.label}
            </span>
          </div>

          <div className="flex items-center gap-1.5 mt-1 text-xs text-on-surface-variant">
            <Building2 className="w-3 h-3" />
            <span className="truncate">{application.job.companyName}</span>
            {application.job.companyVerified && (
              <BadgeCheck className="w-3.5 h-3.5 text-primary shrink-0" />
            )}
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-[11px] text-on-surface-variant">
            {application.job.city && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {application.job.city}
              </span>
            )}
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {EMPLOYMENT_LABEL[application.job.employmentType] ??
                application.job.employmentType}
            </span>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2 mt-3">
            {application.matchScore !== null && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-mono text-[10px] font-bold">
                <Zap className="w-3 h-3" />
                {application.matchScore}% Match
              </span>
            )}
            {application.interviewDate && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-mono text-[10px] font-bold">
                <Calendar className="w-3 h-3" />
                Interview:{' '}
                {new Date(application.interviewDate).toLocaleDateString(
                  'id-ID',
                  { day: 'numeric', month: 'short' }
                )}
              </span>
            )}
          </div>

          <div className="mt-3 pt-3 border-t border-outline-variant/30 flex items-center justify-between">
            <span className="text-[11px] text-on-surface-variant">
              Dilamar {application.appliedAtRelative}
            </span>
            <ChevronRight className="w-4 h-4 text-on-surface-variant/40 group-hover:text-primary transition-colors" />
          </div>
        </div>
      </div>
    </Link>
  )
}