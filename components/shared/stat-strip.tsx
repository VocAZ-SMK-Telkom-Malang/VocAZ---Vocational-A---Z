// components/shared/stat-strip.tsx
import type { LucideIcon } from 'lucide-react'

export type StatItem = {
  icon: LucideIcon
  iconColor: string
  iconBg: string
  value: string
  label: string
}

type Props = {
  stats: StatItem[]
  className?: string
}

export function StatStrip({ stats, className = '' }: Props) {
  const gridCols =
    stats.length === 4
      ? 'grid-cols-2 sm:grid-cols-4'
      : stats.length === 3
        ? 'grid-cols-1 sm:grid-cols-3'
        : 'grid-cols-2 sm:grid-cols-3'

  return (
    <div
      className={`w-full max-w-3xl bg-surface-container-lowest/95 backdrop-blur-xl rounded-full shadow-[0_12px_30px_-8px_rgba(220,38,38,0.09)] ring-1 ring-outline-variant/20 overflow-hidden ${className}`}
    >
      <div className={`grid ${gridCols} divide-x divide-outline-variant/30`}>
        {stats.map((stat, i) => {
          const Icon = stat.icon
          return (
            <div
              key={i}
              className="flex items-center justify-center gap-3 py-3.5 px-4"
            >
              <div
                className={`w-10 h-10 rounded-full ${stat.iconBg} flex items-center justify-center shrink-0`}
              >
                <Icon className={`w-5 h-5 ${stat.iconColor}`} />
              </div>
              <div className="text-left">
                <div className="font-display text-lg font-extrabold text-on-surface leading-none">
                  {stat.value}
                </div>
                <div className="text-[11px] text-on-surface-variant mt-1 whitespace-nowrap">
                  {stat.label}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}