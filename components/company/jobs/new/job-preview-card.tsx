// components/company/jobs/new/job-preview-card.tsx
'use client'

import { Briefcase, MapPin, Clock, Wallet } from 'lucide-react'
import type { JobFilter } from '@/lib/queries/company-jobs'

type Skill = { id: string; name: string }

type Props = {
  companyName: string
  companyLogo: string | null
  companyVerified: boolean
  title: string
  employmentType: string
  workMode: string
  city: string
  province: string
  salaryMin: number | null
  salaryMax: number | null
  isSalaryVisible: boolean
  skills: Skill[]
}

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

function formatRupiah(value: number): string {
  if (value >= 1_000_000) {
    const juta = value / 1_000_000
    return `Rp ${juta % 1 === 0 ? juta : juta.toFixed(1)} jt`
  }
  return `Rp ${new Intl.NumberFormat('id-ID').format(value)}`
}

export function JobPreviewCard({
  companyName,
  companyLogo,
  companyVerified,
  title,
  employmentType,
  workMode,
  city,
  province,
  salaryMin,
  salaryMax,
  isSalaryVisible,
  skills,
}: Props) {
  const salaryLabel = () => {
    if (!isSalaryVisible) return 'Gaji tidak ditampilkan'
    if (salaryMin && salaryMax) {
      return `${formatRupiah(salaryMin)} - ${formatRupiah(salaryMax)}`
    }
    if (salaryMin) return `Min ${formatRupiah(salaryMin)}`
    if (salaryMax) return `Up to ${formatRupiah(salaryMax)}`
    return 'Kompetitif'
  }

  return (
    <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-5 hover:shadow-[0_8px_24px_rgba(183,0,17,0.08)] transition-all">
      {/* Company */}
      <div className="flex items-center gap-3 mb-4">
        {companyLogo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={companyLogo}
            alt={companyName}
            className="w-10 h-10 rounded-lg object-cover shrink-0"
          />
        ) : (
          <div className="w-10 h-10 rounded-lg bg-primary text-white flex items-center justify-center font-bold text-sm shrink-0">
            {companyName.charAt(0)}
          </div>
        )}
        <div className="min-w-0">
          <div className="flex items-center gap-1">
            <span className="text-sm font-bold text-on-surface truncate">
              {companyName}
            </span>
            {companyVerified && (
              <span className="text-primary text-xs">✓</span>
            )}
          </div>
          <span className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider">
            {companyVerified ? 'Verified' : 'Unverified'}
          </span>
        </div>
      </div>

      {/* Title */}
      <h3 className="text-base font-bold text-on-surface mb-3 line-clamp-2 min-h-[2.5em]">
        {title || 'Judul Posisi'}
      </h3>

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] text-on-surface-variant mb-4">
        <span className="inline-flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          {city || 'Kota'}
          {province ? `, ${province}` : ''}
        </span>
        <span className="inline-flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {EMPLOYMENT_LABEL[employmentType] ?? employmentType}
        </span>
        <span className="inline-flex items-center gap-1">
          <Briefcase className="w-3 h-3" />
          {WORK_MODE_LABEL[workMode] ?? workMode}
        </span>
      </div>

      {/* Salary */}
      <div className="flex items-center gap-1.5 mb-4">
        <Wallet className="w-4 h-4 text-primary shrink-0" />
        <span className="text-sm font-bold text-primary">{salaryLabel()}</span>
      </div>

      {/* Skills */}
      {skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-3 border-t border-outline-variant/30">
          {skills.slice(0, 4).map((s) => (
            <span
              key={s.id}
              className="px-2 py-0.5 rounded-md bg-surface-container text-on-surface-variant font-mono text-[10px] font-semibold"
            >
              {s.name}
            </span>
          ))}
          {skills.length > 4 && (
            <span className="px-2 py-0.5 rounded-md bg-surface-container text-on-surface-variant font-mono text-[10px] font-semibold">
              +{skills.length - 4}
            </span>
          )}
        </div>
      )}
    </div>
  )
}