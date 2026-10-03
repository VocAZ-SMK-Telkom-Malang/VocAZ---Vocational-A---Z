// components/company/dashboard/active-jobs-list.tsx
import Link from 'next/link'
import { MapPin, Clock, ChevronRight, Workflow } from 'lucide-react'
import type { ActiveJobDTO } from '@/lib/queries/company-dashboard'

const EMPLOYMENT_LABEL: Record<string, string> = {
  internship: 'Internship',
  part_time: 'Part Time',
  full_time: 'Full Time',
  freelance: 'Freelance',
  volunteer: 'Volunteer',
  contract: 'Contract',
}

const STATUS_STYLE: Record<string, string> = {
  active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  draft: 'bg-surface-container text-on-surface-variant border-outline-variant',
  closed: 'bg-surface-container text-on-surface-variant border-outline-variant',
  archived: 'bg-surface-container text-on-surface-variant border-outline-variant',
}

export function ActiveJobsList({ jobs }: { jobs: ActiveJobDTO[] }) {
  return (
    <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-base font-bold text-on-surface">Lowongan Aktif</h3>
        <Link
          href="/company/jobs"
          className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-0.5"
        >
          Lihat Semua
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {jobs.length === 0 ? (
        <div className="py-8 flex flex-col items-center text-center gap-2">
          <Workflow className="w-8 h-8 text-on-surface-variant/40" />
          <p className="text-sm text-on-surface-variant">Belum ada lowongan aktif</p>
          <Link
            href="/company/jobs/new"
            className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
          >
            Posting lowongan pertama
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {jobs.map((job) => (
            <Link
              key={job.id}
              href={`/company/jobs/${job.id}`}
              className="group flex items-center justify-between gap-4 p-3 rounded-xl hover:bg-surface-container-low transition-colors"
            >
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-bold text-on-surface truncate group-hover:text-primary transition-colors">
                  {job.title}
                </h4>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-on-surface-variant mt-1">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {job.city ?? job.location}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {EMPLOYMENT_LABEL[job.employmentType] ?? job.employmentType}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right">
                  <div className="text-sm font-bold text-on-surface">
                    {job.applicantCount}
                  </div>
                  <div className="font-mono text-[10px] text-on-surface-variant">
                    Pelamar
                  </div>
                </div>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-md border font-mono text-[10px] font-bold ${STATUS_STYLE[job.status] ?? ''}`}
                >
                  {job.status === 'active' ? 'Aktif' : job.status}
                </span>
                <ChevronRight className="w-4 h-4 text-on-surface-variant/40 group-hover:text-primary transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}