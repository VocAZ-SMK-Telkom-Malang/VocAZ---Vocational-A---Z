// components/company/jobs/jobs-stats-strip.tsx
import { Briefcase, Users, Star, TrendingUp } from 'lucide-react'
import type { JobStats } from '@/lib/queries/company-jobs'

type Props = {
  stats: JobStats
}

export function JobsStatsStrip({ stats }: Props) {
  const items = [
    {
      icon: Briefcase,
      label: 'Lowongan Aktif',
      value: stats.activeJobs,
      color: 'bg-primary-fixed/50 text-primary',
    },
    {
      icon: Users,
      label: 'Total Pelamar',
      value: stats.totalApplicants,
      color: 'bg-tertiary-fixed/50 text-tertiary',
    },
    {
      icon: Star,
      label: 'Shortlisted',
      value: stats.shortlisted,
      color: 'bg-secondary-fixed/50 text-secondary',
    },
    {
      icon: TrendingUp,
      label: 'Hiring Pipeline',
      value: stats.hiringPipeline,
      color: 'bg-[#FCE7F3] text-[#9D174D]',
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((item) => {
        const Icon = item.icon
        return (
          <div
            key={item.label}
            className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-4 flex items-center gap-3"
          >
            <div
              className={`w-10 h-10 rounded-lg ${item.color} flex items-center justify-center shrink-0`}
            >
              <Icon className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-2xl font-extrabold text-on-surface leading-none">
                {item.value.toLocaleString('id-ID')}
              </div>
              <div className="text-[11px] text-on-surface-variant mt-1 truncate">
                {item.label}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}