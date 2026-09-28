// components/lowongan/job-card.tsx
import Link from 'next/link'
import {
  MapPin,
  Building2,
  BadgeCheck,
  Clock,
  Banknote,
  Users,
  Flame,
} from 'lucide-react'
import type { PublicJob } from '@/lib/lowongan/queries'

type Props = {
  job: PublicJob
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

function formatSalary(min: number | null, max: number | null, currency: string) {
  if (!min && !max) return null
  const fmt = (n: number) => {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace('.0', '')}jt`
    if (n >= 1_000) return `${(n / 1_000).toFixed(0)}rb`
    return n.toString()
  }
  if (min && max) return `${currency} ${fmt(min)} - ${fmt(max)}`
  if (min) return `${currency} ${fmt(min)}+`
  if (max) return `≤ ${currency} ${fmt(max)}`
  return null
}

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  if (days === 0) return 'Hari ini'
  if (days === 1) return 'Kemarin'
  if (days < 7) return `${days} hari lalu`
  if (days < 30) return `${Math.floor(days / 7)} minggu lalu`
  return `${Math.floor(days / 30)} bulan lalu`
}

function daysUntil(date: string | null) {
  if (!date) return null
  const diff = new Date(date).getTime() - Date.now()
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
  return days > 0 ? days : 0
}

export function JobCard({ job }: Props) {
  const salary = job.isSalaryVisible
    ? formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency)
    : null
  const expiredIn = daysUntil(job.expiredAt)
  const isExpiringSoon = expiredIn !== null && expiredIn <= 3 && expiredIn > 0
  const isNew =
    Date.now() - new Date(job.publishedAt || job.createdAt).getTime() <
    24 * 60 * 60 * 1000

  return (
    <Link
      href={`/lowongan/${job.slug}`}
      className="group relative flex flex-col bg-surface-container-lowest rounded-2xl shadow-[0_1px_3px_rgba(17,24,39,0.04)] hover:shadow-[0_10px_25px_-5px_rgba(220,38,38,0.12),0_8px_10px_-6px_rgba(17,24,39,0.04)] ring-1 ring-outline-variant/30 hover:ring-primary/30 hover:-translate-y-0.5 transition-all duration-300 overflow-hidden"
    >
      {/* Ribbon */}
      {(isExpiringSoon || isNew) && (
        <div
          className={`absolute top-3 right-3 z-10 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm ${
            isNew
              ? 'bg-emerald-600 text-white'
              : 'bg-gradient-to-r from-[#ff5757] to-[#ea580c] text-white'
          }`}
        >
          {isNew ? (
            <>
              <span>⚡</span>
              <span>Baru</span>
            </>
          ) : (
            <>
              <Flame className="w-3 h-3" />
              <span>Tutup {expiredIn}h lagi</span>
            </>
          )}
        </div>
      )}

      <div className="p-5 flex flex-col gap-4 flex-1">
        {/* Company */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center shrink-0 overflow-hidden ring-1 ring-outline-variant/20">
            {job.company.logoUrl ? (
              <img
                src={job.company.logoUrl}
                alt={job.company.name}
                className="w-full h-full object-contain"
              />
            ) : (
              <Building2 className="w-5 h-5 text-on-surface-variant" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1">
              <span className="font-display text-sm font-bold text-on-surface truncate">
                {job.company.name}
              </span>
              {job.company.verificationStatus === 'verified' && (
                <BadgeCheck className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              )}
            </div>
            {job.company.industry && (
              <span className="text-[11px] text-on-surface-variant truncate block">
                {job.company.industry}
              </span>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="font-display text-base font-bold text-on-surface leading-snug line-clamp-2 group-hover:text-primary transition-colors min-h-[2.8em]">
          {job.title}
        </h3>

        {/* Meta chips */}
        <div className="flex flex-wrap items-center gap-1.5">
          {job.city && (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-surface-container-low text-on-surface px-2 py-1 rounded-md">
              <MapPin className="w-3 h-3 text-[#ea580c]" />
              {job.city}
            </span>
          )}
          <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-amber-50 text-amber-800 px-2 py-1 rounded-md">
            <Clock className="w-3 h-3" />
            {EMPLOYMENT_LABELS[job.employmentType] || job.employmentType}
          </span>
          <span className="inline-flex items-center text-[11px] font-medium bg-surface-container-low text-on-surface-variant px-2 py-1 rounded-md">
            {WORK_MODE_LABELS[job.workMode] || job.workMode}
          </span>
          {salary && (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-1 rounded-md">
              <Banknote className="w-3 h-3" />
              {salary}
            </span>
          )}
        </div>

        {/* Skills */}
        {job.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {job.skills.slice(0, 3).map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center px-2 py-0.5 rounded-md bg-[#fff1ec] text-[#ad5d00] text-[10px] font-semibold"
              >
                {skill}
              </span>
            ))}
            {job.skills.length > 3 && (
              <span className="text-[10px] text-on-surface-variant font-semibold self-center">
                +{job.skills.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 mt-auto border-t border-outline-variant/20 text-[11px] text-on-surface-variant">
          <span className="inline-flex items-center gap-1">
            <Users className="w-3 h-3" />
            Kuota {job.quota}
          </span>
          <span>{timeAgo(job.publishedAt || job.createdAt)}</span>
        </div>
      </div>

      {/* CTA */}
      <div className="px-5 pb-5">
        <div className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-[#ff5757] to-[#dc2626] text-white text-xs font-bold shadow-sm group-hover:brightness-105 transition-all">
          <span>Lihat Lowongan</span>
          <span className="text-base">→</span>
        </div>
      </div>
    </Link>
  )
}