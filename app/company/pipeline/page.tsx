// app/company/pipeline/page.tsx
import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Briefcase,
  Users,
  MapPin,
  Clock,
  ChevronRight,
} from 'lucide-react'
import { getCompanyContext } from '@/lib/queries/company-dashboard'
import { getPipelineJobs } from '@/lib/queries/company-pipeline'

export const metadata = {
  title: 'Pipeline Rekrutmen — VocAZ',
}

const EMPLOYMENT_LABEL: Record<string, string> = {
  internship: 'Internship',
  part_time: 'Part Time',
  full_time: 'Full Time',
  freelance: 'Freelance',
  volunteer: 'Volunteer',
  contract: 'Contract',
}

export default async function PipelineJobsPage() {
  const ctx = await getCompanyContext()
  if (!ctx) redirect('/register/company/1')

  const jobs = await getPipelineJobs(ctx.companyId)

  return (
    <div className="max-w-[1400px] mx-auto flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-on-surface tracking-tight">
          Pipeline Rekrutmen
        </h1>
        <p className="text-sm text-on-surface-variant mt-1">
          Pilih lowongan untuk melihat board pipeline pelamar.
        </p>
      </div>

      {/* Empty */}
      {jobs.length === 0 && (
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 py-16 text-center">
          <Briefcase className="w-12 h-12 text-on-surface-variant/40 mx-auto mb-3" />
          <h3 className="text-base font-bold text-on-surface mb-1">
            Belum ada lowongan aktif
          </h3>
          <p className="text-sm text-on-surface-variant mb-5">
            Posting lowongan dulu untuk melihat pipeline pelamar.
          </p>
          <Link
            href="/company/jobs/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-white font-bold text-sm hover:bg-primary-container transition-colors"
          >
            Posting Lowongan
          </Link>
        </div>
      )}

      {/* Jobs grid */}
      {jobs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs.map((job) => (
            <Link
              key={job.id}
              href={`/company/pipeline/${job.id}`}
              className="group bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary-fixed/50 text-primary flex items-center justify-center shrink-0">
                  <Briefcase className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-on-surface line-clamp-2 group-hover:text-primary transition-colors">
                    {job.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-[11px] text-on-surface-variant">
                    {job.city && (
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {job.city}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {EMPLOYMENT_LABEL[job.employmentType] ?? job.employmentType}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-outline-variant/30 flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs">
                  <span className="inline-flex items-center gap-1 text-on-surface-variant">
                    <Users className="w-3.5 h-3.5" />
                    <span className="font-bold text-on-surface">
                      {job.totalApplicants}
                    </span>
                    <span>pelamar</span>
                  </span>
                  {job.activeApplicants > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-mono text-[10px] font-bold">
                      {job.activeApplicants} aktif
                    </span>
                  )}
                </div>
                <ChevronRight className="w-4 h-4 text-on-surface-variant/40 group-hover:text-primary transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}