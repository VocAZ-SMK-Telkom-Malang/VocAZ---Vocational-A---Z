// components/company/jobs/detail/job-activity-tab.tsx
import {
  FileText,
  Rocket,
  UserPlus,
  Activity,
  Clock,
} from 'lucide-react'
import type { JobDetail } from '@/lib/queries/company-job-detail'

const TYPE_ICON: Record<
  string,
  { icon: React.ComponentType<{ className?: string }>; color: string }
> = {
  created: { icon: FileText, color: 'bg-slate-100 text-slate-600' },
  published: { icon: Rocket, color: 'bg-emerald-50 text-emerald-700' },
  application: { icon: UserPlus, color: 'bg-blue-50 text-blue-700' },
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function JobActivityTab({ job }: { job: JobDetail }) {
  if (job.activity.length === 0) {
    return (
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 py-12 text-center">
        <Activity className="w-10 h-10 text-on-surface-variant/40 mx-auto mb-3" />
        <p className="text-sm text-on-surface-variant">Belum ada aktivitas</p>
      </div>
    )
  }

  return (
    <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6">
      <div className="flex items-center gap-2 mb-5">
        <Activity className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-bold text-on-surface">Activity Log</h3>
      </div>

      <div className="flex flex-col gap-4">
        {job.activity.map((item, idx) => {
          const cfg = TYPE_ICON[item.type] ?? TYPE_ICON.created
          const Icon = cfg.icon
          const isLast = idx === job.activity.length - 1

          return (
            <div key={item.id} className="flex gap-3">
              {/* Timeline */}
              <div className="flex flex-col items-center shrink-0">
                <div
                  className={`w-9 h-9 rounded-full ${cfg.color} flex items-center justify-center`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                {!isLast && (
                  <div className="flex-1 w-px bg-outline-variant/40 my-1" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 pb-4">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-sm font-semibold text-on-surface">
                    {item.label}
                  </h4>
                  <span className="font-mono text-[10px] text-on-surface-variant whitespace-nowrap">
                    <Clock className="w-3 h-3 inline mr-1" />
                    {formatDateTime(item.timestamp)}
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  {item.description}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}