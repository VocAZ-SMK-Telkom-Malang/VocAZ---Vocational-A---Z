// components/company/jobs/detail/job-detail-header.tsx
import Link from 'next/link'
import { ArrowLeft, Eye, Users, Edit } from 'lucide-react'
import { JobStatusBadge } from '../job-status-badge'
import { JobActionsMenu } from './job-actions-menu'

const EMPLOYMENT_LABEL: Record<string, string> = {
  internship: 'Internship',
  part_time: 'Part Time',
  full_time: 'Full Time',
  freelance: 'Freelance',
  volunteer: 'Volunteer',
  contract: 'Contract',
}

const WORK_MODE_LABEL: Record<string, string> = {
  onsite: 'On-site',
  remote: 'Remote',
  hybrid: 'Hybrid',
}

type Props = {
  jobId: string
  jobSlug: string
  title: string
  status: string
  employmentType: string
  workMode: string
  city: string | null
  province: string | null
  applicantCount: number
  viewCount: number
  isDeleted: boolean
}

export function JobDetailHeader({
  jobId,
  jobSlug,
  title,
  status,
  employmentType,
  workMode,
  city,
  province,
  applicantCount,
  viewCount,
  isDeleted,
}: Props) {
  return (
    <div className="flex flex-col gap-4">
      {/* Back */}
      <Link
        href="/company/jobs"
        className="inline-flex items-center gap-2 text-sm font-medium text-on-surface-variant hover:text-primary transition-colors w-fit"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali ke Lowongan
      </Link>

      {/* Header Row */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <JobStatusBadge status={status} />
            {isDeleted && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-error/10 text-error border border-error/20 font-mono text-[10px] font-bold uppercase tracking-wider">
                Dihapus
              </span>
            )}
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold text-on-surface tracking-tight">
            {title}
          </h1>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-on-surface-variant">
            <span>
              {EMPLOYMENT_LABEL[employmentType] ?? employmentType}
            </span>
            <span className="w-1 h-1 rounded-full bg-on-surface-variant/40" />
            <span>{WORK_MODE_LABEL[workMode] ?? workMode}</span>
            {city && (
              <>
                <span className="w-1 h-1 rounded-full bg-on-surface-variant/40" />
                <span>
                  {city}
                  {province ? `, ${province}` : ''}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href={`/company/jobs/${jobId}/applicants`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-white font-bold text-sm shadow-[0_4px_16px_rgba(183,0,17,0.20)] hover:bg-primary-container transition-colors"
          >
            <Users className="w-4 h-4" />
            Lihat Pelamar
            <span className="ml-1 px-1.5 py-0.5 rounded-md bg-white/20 text-xs font-mono">
              {applicantCount}
            </span>
          </Link>

          {!isDeleted && (
            <Link
              href={`/company/jobs/${jobId}/edit`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container-lowest border border-outline-variant/40 text-on-surface font-bold text-sm hover:bg-surface-container transition-colors"
            >
              <Edit className="w-4 h-4" />
              Edit
            </Link>
          )}

          <JobActionsMenu
            jobId={jobId}
            jobSlug={jobSlug}
            status={status}
            isDeleted={isDeleted}
          />
        </div>
      </div>
    </div>
  )
}