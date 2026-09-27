// components/student/dashboard/recommended-jobs.tsx
import Link from 'next/link'
import { ArrowRight, MapPin, Building2, BadgeCheck } from 'lucide-react'

type Job = {
  id: string
  title: string
  slug: string
  city: string | null
  employmentType: string
  workMode: string
  company: {
    id: string
    name: string
    slug: string
    logoUrl: string | null
    city: string | null
    verificationStatus: string
  }
  skills: {
    skill: { id: string; name: string }
  }[]
  _count: { applications: number }
}

type Props = {
  jobs: Job[]
}

export function RecommendedJobs({ jobs }: Props) {
  if (jobs.length === 0) {
    return (
      <div className="bg-white rounded-2xl ring-1 ring-outline-variant/30 p-8 text-center">
        <div className="w-12 h-12 rounded-xl bg-surface-container mx-auto flex items-center justify-center mb-3">
          <Building2 className="w-6 h-6 text-on-surface-variant" />
        </div>
        <p className="text-sm font-semibold text-on-surface mb-1">
          Belum ada rekomendasi
        </p>
        <p className="text-xs text-on-surface-variant mb-4">
          Tambahkan skill di profilmu untuk mendapat rekomendasi lowongan.
        </p>
        <Link
          href="/student/profile/skills"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:gap-2 transition-all"
        >
          <span>Tambah skill</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {jobs.map((job) => (
        <Link
          key={job.id}
          href={`/student/jobs/${job.slug}`}
          className="group block bg-white rounded-2xl ring-1 ring-outline-variant/30 p-4 hover:ring-primary/30 hover:shadow-[0_4px_16px_rgba(183,0,17,0.04)] transition-all"
        >
          <div className="flex items-start gap-4">
            {/* Logo */}
            <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center shrink-0 overflow-hidden">
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

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-display text-sm font-bold text-on-surface group-hover:text-primary transition-colors truncate mb-0.5">
                {job.title}
              </h3>

              <div className="flex items-center gap-1.5 mb-2">
                <span className="text-xs text-on-surface-variant truncate">
                  {job.company.name}
                </span>
                {job.company.verificationStatus === 'verified' && (
                  <BadgeCheck className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2 text-[11px] text-on-surface-variant">
                {job.city && (
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {job.city}
                  </span>
                )}
                <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-surface-container font-medium">
                  {job.employmentType.replace('_', ' ')}
                </span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-surface-container font-medium">
                  {job.workMode}
                </span>
              </div>
            </div>

            <ArrowRight className="w-4 h-4 text-on-surface-variant group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0 mt-3" />
          </div>
        </Link>
      ))}
    </div>
  )
}