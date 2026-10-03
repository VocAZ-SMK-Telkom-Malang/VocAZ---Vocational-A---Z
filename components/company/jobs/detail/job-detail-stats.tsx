// components/company/jobs/detail/job-detail-stats.tsx
import { Users, Star, UserCheck, XCircle } from 'lucide-react'
import type { JobDetail } from '@/lib/queries/company-job-detail'

type Props = {
  stats: JobDetail['stats']
}

export function JobDetailStats({ stats }: Props) {
  const items = [
    {
      icon: Users,
      label: 'Total Pelamar',
      value: stats.totalApplicants,
      color: 'bg-primary-fixed/50 text-primary',
    },
    {
      icon: Star,
      label: 'Shortlisted',
      value: stats.shortlisted + stats.interview + stats.offered + stats.hired,
      color: 'bg-tertiary-fixed/50 text-tertiary',
    },
    {
      icon: UserCheck,
      label: 'Diterima',
      value: stats.hired,
      color: 'bg-emerald-500/15 text-emerald-700',
    },
    {
      icon: XCircle,
      label: 'Ditolak',
      value: stats.rejected,
      color: 'bg-error/10 text-error',
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
                {item.value}
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