// components/student/jobs/similar-jobs.tsx
import Link from 'next/link'
import { MapPin, Building2, ArrowRight } from 'lucide-react'

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
  }
}

type Props = {
  jobs: Job[]
}

const EMPLOYMENT_LABELS: Record<string, string> = {
  internship: 'Magang',
  part_time: 'Part-time',
  full_time: 'Full-time',
  freelance: 'Freelance',
  volunteer: 'Volunteer',
  contract: 'Kontrak',
}

export function SimilarJobs({ jobs }: Props) {
  if (jobs.length === 0) return null

  return (
    <div className="bg-white rounded-2xl ring-1 ring-outline-variant/30 p-5">
      <h3 className="font-display text-sm font-bold text-on-surface mb-4">
        Lowongan Serupa
      </h3>

      <ul className="space-y-2">
        {jobs.map((job) => (
          <li key={job.id}>
            <Link
              href={`/student/jobs/${job.slug}`}
              className="group flex items-start gap-3 p-3 rounded-xl hover:bg-surface-container-low transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center shrink-0 overflow-hidden">
                {job.company.logoUrl ? (
                  <img
                    src={job.company.logoUrl}
                    alt={job.company.name}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <Building2 className="w-4 h-4 text-on-surface-variant" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-on-surface group-hover:text-primary transition-colors line-clamp-2 mb-0.5">
                  {job.title}
                </p>
                <p className="text-[11px] text-on-surface-variant truncate mb-1">
                  {job.company.name}
                </p>
                <div className="flex items-center gap-2 text-[10px] text-on-surface-variant">
                  {job.city && (
                    <span className="inline-flex items-center gap-0.5">
                      <MapPin className="w-2.5 h-2.5" />
                      {job.city}
                    </span>
                  )}
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-surface-container font-medium">
                    {EMPLOYMENT_LABELS[job.employmentType] ||
                      job.employmentType}
                  </span>
                </div>
              </div>

              <ArrowRight className="w-3.5 h-3.5 text-on-surface-variant group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}