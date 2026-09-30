// components/student/jobs/job-card.tsx
'use client'

import Link from 'next/link'
import { Building2, MapPin, Clock, Users, BadgeCheck } from 'lucide-react'
import { formatSalary, type Job } from './types'
import { SaveJobButton } from './save-job-button'

type Props = {
  job: Job
}

export function JobCard({ job }: Props) {
  const href = `/student/jobs/${job.slug ?? job.id}`

  return (
    <Link
      href={href}
      className="group relative flex flex-col p-5 bg-surface-container-lowest rounded-2xl border border-outline-variant/30 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all"
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
          <Building2 className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold text-on-surface leading-snug line-clamp-2 group-hover:text-primary transition-colors">
            {job.title}
          </h3>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-sm text-on-surface-variant truncate">
              {job.company}
            </span>
            {job.companyVerified && (
              <BadgeCheck className="w-4 h-4 text-primary shrink-0" />
            )}
          </div>
        </div>

        {/* Save button */}
        <div onClick={(e) => { e.preventDefault(); e.stopPropagation() }}>
          <SaveJobButton
            jobId={job.id}
            initialSaved={job.saved ?? false}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1.5 mb-3">
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-surface-container text-[11px] font-medium text-on-surface-variant">
          <MapPin className="w-3 h-3" />
          {job.location}
        </span>
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-surface-container text-[11px] font-medium text-on-surface-variant">
          <Clock className="w-3 h-3" />
          {job.type}
        </span>
        <span
          className={`inline-flex items-center px-2 py-1 rounded-md text-[11px] font-semibold ${
            job.mode === 'Remote'
              ? 'bg-emerald-50 text-emerald-700'
              : job.mode === 'Hybrid'
                ? 'bg-amber-50 text-amber-700'
                : 'bg-blue-50 text-blue-700'
          }`}
        >
          {job.mode}
        </span>
        <span className="inline-flex items-center px-2 py-1 rounded-md bg-emerald-50 text-[11px] font-semibold text-emerald-700">
          💰 {formatSalary(job.salaryMin, job.salaryMax)}
        </span>
      </div>

      {job.skills && job.skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {job.skills.slice(0, 3).map((s) => (
            <span
              key={s}
              className="px-2 py-0.5 rounded-md bg-primary/5 text-[10px] font-semibold text-primary"
            >
              {s}
            </span>
          ))}
        </div>
      )}

      <div className="mt-auto pt-3 border-t border-outline-variant/20 flex items-center justify-between text-[11px] text-on-surface-variant">
        <span className="inline-flex items-center gap-1">
          <Users className="w-3 h-3" />
          {job.applicants ?? 0} pelamar
        </span>
        <span>{job.postedAt ?? 'Baru saja'}</span>
      </div>
    </Link>
  )
}