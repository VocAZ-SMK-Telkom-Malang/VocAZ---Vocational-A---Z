// components/student/jobs/job-detail-header.tsx
import Link from 'next/link'
import {
  MapPin,
  Building2,
  BadgeCheck,
  Clock,
  Users,
  Banknote,
  Calendar,
  Briefcase,
  Globe,
} from 'lucide-react'
import { ApplyJobButton } from './apply-job-button'
import { SaveJobButton } from './save-job-button'

type Job = {
  id: string
  title: string
  slug: string
  city: string | null
  province: string | null
  employmentType: string
  workMode: string
  experienceLevel: string | null
  salaryMin: bigint | null
  salaryMax: bigint | null
  salaryCurrency: string
  isSalaryVisible: boolean
  quota: number
  publishedAt: Date | null
  expiredAt: Date | null
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
  _count: { applications: number }
}

type Props = {
  job: Job
  hasApplied: boolean
  applicationStatus?: string | null
  hasSaved: boolean
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

const EXPERIENCE_LABELS: Record<string, string> = {
  entry: 'Entry Level',
  junior: 'Junior',
  mid: 'Mid Level',
  senior: 'Senior',
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

function formatDate(date: Date | null) {
  if (!date) return null
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function JobDetailHeader({
  job,
  hasApplied,
  applicationStatus,
  hasSaved,
}: Props) {
  const salary = job.isSalaryVisible
    ? formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency)
    : null

  return (
    <div className="bg-white rounded-2xl ring-1 ring-outline-variant/30 overflow-hidden">
      {/* Banner */}
      <div className="h-20 bg-gradient-to-r from-primary via-[#E03E3E] to-[#B70011]" />

      <div className="px-6 sm:px-8 pb-6">
        {/* Logo + Save button */}
        <div className="flex items-start justify-between gap-4 -mt-10 mb-4">
          <div className="w-20 h-20 rounded-2xl bg-white ring-4 ring-white shadow-lg flex items-center justify-center overflow-hidden shrink-0">
            {job.company.logoUrl ? (
              <img
                src={job.company.logoUrl}
                alt={job.company.name}
                className="w-full h-full object-contain"
              />
            ) : (
              <Building2 className="w-8 h-8 text-on-surface-variant" />
            )}
          </div>
          <div className="mt-12">
            <SaveJobButton
              jobId={job.id}
              initialSaved={hasSaved}
              variant="button"
            />
          </div>
        </div>

        {/* Title + Company */}
        <div className="mb-4">
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight mb-2">
            {job.title}
          </h1>

          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href={`/student/companies/${job.company.slug}`}
              className="text-sm font-semibold text-primary hover:underline"
            >
              {job.company.name}
            </Link>
            {job.company.verificationStatus === 'verified' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-wider">
                <BadgeCheck className="w-3 h-3" />
                Terverifikasi
              </span>
            )}
          </div>
        </div>

        {/* Meta grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {job.city && (
            <MetaItem
              icon={MapPin}
              label="Lokasi"
              value={`${job.city}${job.province ? `, ${job.province}` : ''}`}
            />
          )}
          <MetaItem
            icon={Clock}
            label="Tipe"
            value={EMPLOYMENT_LABELS[job.employmentType] || job.employmentType}
          />
          <MetaItem
            icon={Briefcase}
            label="Mode"
            value={WORK_MODE_LABELS[job.workMode] || job.workMode}
          />
          {job.experienceLevel && (
            <MetaItem
              icon={Globe}
              label="Level"
              value={
                EXPERIENCE_LABELS[job.experienceLevel] || job.experienceLevel
              }
            />
          )}
        </div>

        {/* Extra meta */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-6 text-xs text-on-surface-variant">
          {salary && (
            <span className="inline-flex items-center gap-1.5 text-emerald-700 font-semibold">
              <Banknote className="w-3.5 h-3.5" />
              {salary}
            </span>
          )}
          <span className="inline-flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" />
            {job._count.applications} pelamar
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5" />
            Kuota: {job.quota} orang
          </span>
          {job.publishedAt && (
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              Dipublikasikan {formatDate(job.publishedAt)}
            </span>
          )}
          {job.expiredAt && (
            <span className="inline-flex items-center gap-1.5 text-red-600 font-semibold">
              <Calendar className="w-3.5 h-3.5" />
              Batas: {formatDate(job.expiredAt)}
            </span>
          )}
        </div>

        {/* CTA */}
        <div className="flex flex-wrap items-center gap-3">
          <ApplyJobButton
            jobId={job.id}
            jobTitle={job.title}
            companyName={job.company.name}
            hasApplied={hasApplied}
            applicationStatus={applicationStatus}
          />
        </div>
      </div>
    </div>
  )
}

function MetaItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
}) {
  return (
    <div className="flex items-start gap-2.5 p-3 rounded-xl bg-surface-container-low">
      <Icon className="w-4 h-4 text-primary shrink-0 mt-0.5" />
      <div className="min-w-0">
        <p className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider mb-0.5">
          {label}
        </p>
        <p className="text-xs font-semibold text-on-surface truncate">
          {value}
        </p>
      </div>
    </div>
  )
}