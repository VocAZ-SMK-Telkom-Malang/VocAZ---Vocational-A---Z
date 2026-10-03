// components/company/jobs/detail/job-skill-match-tab.tsx
import { Sparkles, ArrowRight } from 'lucide-react'
import type { JobDetail } from '@/lib/queries/company-job-detail'

export function JobSkillMatchTab({ job }: { job: JobDetail }) {
  return (
    <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-8 text-center">
      <div className="w-16 h-16 rounded-full bg-tertiary-fixed/50 flex items-center justify-center mx-auto mb-4">
        <Sparkles className="w-8 h-8 text-tertiary" />
      </div>
      <h3 className="text-lg font-bold text-on-surface mb-2">
        Smart Talent Match
      </h3>
      <p className="text-sm text-on-surface-variant max-w-md mx-auto mb-5">
        Fitur ini akan menampilkan kandidat terbaik berdasarkan kecocokan skill
        dengan lowongan <strong>{job.title}</strong>. Sedang dalam pengembangan.
      </p>

      <a
        href="/company/talent-match"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-white font-bold text-sm shadow-md hover:bg-primary-container transition-colors"
      >
        Jelajahi Smart Match
        <ArrowRight className="w-4 h-4" />
      </a>
    </div>
  )
}