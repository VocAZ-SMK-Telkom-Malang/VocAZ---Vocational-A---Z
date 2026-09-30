// components/student/saved/saved-job-card.tsx
'use client'

import Link from 'next/link'
import {
  Building2,
  MapPin,
  Clock,
  Bookmark,
  BadgeCheck,
  ArrowUpRight,
  Send,
} from 'lucide-react'
import { formatSalary, formatRelativeDate, type SavedJob } from './types'

type Props = {
  job: SavedJob
  onUnsave: (id: string) => void
}

export function SavedJobCard({ job, onUnsave }: Props) {
  const href = `/student/jobs/${job.jobSlug}`

  return (
    <Link
      href={href}
      className="group relative flex flex-col p-5 bg-surface-container-lowest rounded-2xl border border-outline-variant/30 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all"
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm"
          style={{ backgroundColor: job.companyLogoColor }}
        >
          <Building2 className="w-5 h-5" />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold text-on-surface leading-snug line-clamp-2 group-hover:text-primary transition-colors">
            {job.jobTitle}
          </h3>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-sm text-on-surface-variant truncate">
              {job.companyName}
            </span>
            {job.companyVerified && (
              <BadgeCheck className="w-3.5 h-3.5 text-primary shrink-0" />
            )}
          </div>
        </div>

        {/* Unsave */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onUnsave(job.id)
          }}
          className="p-1.5 rounded-lg text-primary bg-primary/10 hover:bg-rose-100 hover:text-rose-600 transition-colors shrink-0"
          aria-label="Hapus dari tersimpan"
        >
          <Bookmark className="w-4 h-4 fill-current" />
        </button>
      </div>

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-1.5 mb-3">
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-surface-container text-[11px] font-medium text-on-surface-variant">
          <MapPin className="w-3 h-3" />
          {job.jobLocation}
        </span>
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-surface-container text-[11px] font-medium text-on-surface-variant">
          <Clock className="w-3 h-3" />
          {job.jobType}
        </span>
        <span
          className={`inline-flex items-center px-2 py-1 rounded-md text-[11px] font-semibold ${
            job.jobMode === 'Remote'
              ? 'bg-emerald-50 text-emerald-700'
              : job.jobMode === 'Hybrid'
                ? 'bg-amber-50 text-amber-700'
                : 'bg-blue-50 text-blue-700'
          }`}
        >
          {job.jobMode}
        </span>
        <span className="inline-flex items-center px-2 py-1 rounded-md bg-emerald-50 text-[11px] font-semibold text-emerald-700">
          💰 {formatSalary(job.salaryMin, job.salaryMax)}
        </span>
      </div>

      {/* Skills */}
      {job.skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {job.skills.slice(0, 4).map((s) => (
            <span
              key={s}
              className="px-2 py-0.5 rounded-md bg-primary/5 text-[10px] font-semibold text-primary"
            >
              {s}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="mt-auto pt-3 border-t border-outline-variant/20 flex items-center justify-between gap-2">
        <span className="text-[10px] text-on-surface-variant">
          Disimpan {formatRelativeDate(job.savedAt)}
        </span>
        <div className="flex items-center gap-1">
          <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-white text-[11px] font-bold group-hover:bg-primary/90 transition-colors">
            <Send className="w-3 h-3" />
            Lamar
          </span>
          <span className="p-1.5 rounded-lg text-on-surface-variant group-hover:bg-surface-container transition-colors">
            <ArrowUpRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </Link>
  )
}