// components/student/jobs/job-card.tsx
'use client'

import Link from 'next/link'
import {
  MapPin,
  Building2,
  BadgeCheck,
  Clock,
  Users,
  Banknote,
  Bookmark,
} from 'lucide-react'

type Job = {
  id: string
  title: string
  slug: string
  city: string | null
  employmentType: string
  workMode: string
  experienceLevel: string | null
  salaryMin: bigint | null
  salaryMax: bigint | null
  salaryCurrency: string
  isSalaryVisible: boolean
  publishedAt: Date | null
  createdAt: Date
  company: {
    id: string
    name: string
    slug: string
    logoUrl: string | null
    city: string | null
    province: string | null
    verificationStatus: string
  }
  skills: { skill: { id: string; name: string } }[]
  _count: { applications: number }
}

type Props = {
  job: Job
}

const EMPLOYMENT_LABELS: Record<string, string> = {
  internship: 'Magang',
  part_time: 'Part-time',
  full_time: 'Full-time',
  freelance: 'Freelance',
  volunteer: 'Volunteer',
  contract: 'Kontrak',
}

const WORK_MODE_LABELS: Record<string, string> = {
  onsite: 'Onsite',
  remote: 'Remote',
  hybrid: 'Hybrid',
}

function formatSalary(
  min: bigint | null,
  max: bigint | null,
  currency: string
) {
  if (!min && !max) return null
  const fmt = (n: bigint) => {
    const num = Number(n)
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(0)}jt`
    if (num >= 1_000) return `${(num / 1_000).toFixed(0)}rb`
    return num.toString()
  }
  if (min && max) return `${currency} ${fmt(min)} - ${fmt(max)}`
  if (min) return `${currency} ${fmt(min)}+`
  if (max) return `≤ ${currency} ${fmt(max)}`
  return null
}

function timeAgo(date: Date) {
  const diff = Date.now() - new Date(date).getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  if (days === 0) return 'Hari ini'
  if (days === 1) return 'Kemarin'
  if (days < 7) return `${days} hari lalu`
  if (days < 30) return `${Math.floor(days / 7)} minggu lalu`
  return `${Math.floor(days / 30)} bulan lalu`
}

export function JobCard({ job }: Props) {
  const salary = job.isSalaryVisible
    ? formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency)
    : null

  return (
    <Link
      href={`/student/jobs/${job.slug}`}
      className="group block bg-white rounded-2xl ring-1 ring-outline-variant/30 p-5 hover:ring-primary/30 hover:shadow-[0_8px_24px_rgba(183,0,17,0.06)] hover:-translate-y-0.5 transition-all"
    >
      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        <div className="w-14 h-14 rounded-xl bg-surface-container flex items-center justify-center shrink-0 overflow-hidden ring-1 ring-outline-variant/20">
          {job.company.logoUrl ? (
            <img
              src={job.company.logoUrl}
              alt={job.company.name}
              className="w-full h-full object-contain"
            />
          ) : (
            <Building2 className="w-6 h-6 text-on-surface-variant" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-display text-base font-bold text-on-surface group-hover:text-primary transition-colors line-clamp-2 mb-1">
            {job.title}
          </h3>

          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-medium text-on-surface-variant truncate">
              {job.company.name}
            </span>
            {job.company.verificationStatus === 'verified' && (
              <BadgeCheck className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            // TODO: save job
          }}
          className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors shrink-0"
          aria-label="Simpan lowongan"
        >
          <Bookmark className="w-4 h-4" />
        </button>
      </div>

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mb-3 text-[11px] text-on-surface-variant">
        {job.city && (
          <span className="inline-flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {job.city}
          </span>
        )}

        <span className="inline-flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {EMPLOYMENT_LABELS[job.employmentType] || job.employmentType}
        </span>

        <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-surface-container font-medium">
          {WORK_MODE_LABELS[job.workMode] || job.workMode}
        </span>

        {salary && (
          <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
            <Banknote className="w-3 h-3" />
            {salary}
          </span>
        )}
      </div>

      {/* Skills */}
      {job.skills.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {job.skills.slice(0, 3).map(({ skill }) => (
            <span
              key={skill.id}
              className="inline-flex items-center px-2 py-0.5 rounded-md bg-primary/5 text-primary text-[10px] font-semibold"
            >
              {skill.name}
            </span>
          ))}
          {job.skills.length > 3 && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-surface-container text-on-surface-variant text-[10px] font-semibold">
              +{job.skills.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-outline-variant/20 text-[11px] text-on-surface-variant">
        <span className="inline-flex items-center gap-1">
          <Users className="w-3 h-3" />
          {job._count.applications} pelamar
        </span>
        <span>{timeAgo(job.publishedAt || job.createdAt)}</span>
      </div>
    </Link>
  )
}