// components/company/dashboard/recruitment-trend-chart.tsx
import { BarChart3, CalendarDays } from 'lucide-react'
import type { TrendPoint } from '@/lib/queries/company-dashboard'

type Props = {
  data: TrendPoint[]
  period?: string
}

export function RecruitmentTrendChart({ data, period = '30 Hari Terakhir' }: Props) {
  const max = Math.max(...data.map((d) => d.total), 1)
  const topIdx = data.findIndex((d) => d.total === max)

  return (
    <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-bold text-on-surface">Ringkasan Rekrutmen</h3>
          <p className="font-mono text-[11px] text-on-surface-variant mt-0.5">
            Applicants Trend by Role
          </p>
        </div>
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container-low font-mono text-[10px] font-semibold text-on-surface-variant">
          <CalendarDays className="w-3 h-3" />
          {period}
        </span>
      </div>

      {data.length === 0 ? (
        <div className="h-56 flex flex-col items-center justify-center text-center gap-2">
          <BarChart3 className="w-10 h-10 text-on-surface-variant/40" />
          <p className="text-sm text-on-surface-variant">Belum ada data rekrutmen</p>
        </div>
      ) : (
        <div className="flex items-end justify-between gap-3 h-56">
          {data.map((point, idx) => {
            const height = (point.total / max) * 100
            const isTop = idx === topIdx
            return (
              <div key={point.jobId} className="flex-1 flex flex-col items-center gap-2 group">
                <div className="font-mono text-[10px] font-bold text-on-surface">
                  {point.total}
                </div>
                <div className="w-full flex-1 flex items-end">
                  <div
                    className={
                      isTop
                        ? 'w-full rounded-t-lg bg-gradient-to-t from-primary to-primary-container transition-all group-hover:opacity-90'
                        : 'w-full rounded-t-lg bg-primary-fixed transition-all group-hover:opacity-90'
                    }
                    style={{ height: `${height}%`, minHeight: '8px' }}
                  />
                </div>
                <div className="text-center w-full">
                  <div className="text-[10px] text-on-surface-variant line-clamp-2 leading-tight">
                    {point.label}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}