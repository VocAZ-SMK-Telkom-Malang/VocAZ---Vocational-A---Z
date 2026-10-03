// components/company/dashboard/stat-card.tsx
import Link from 'next/link'
import {
  Briefcase,
  Users,
  UserSearch,
  Mail,
  TrendingUp,
  TrendingDown,
  type LucideIcon,
} from 'lucide-react'

type IconKey = 'work' | 'group' | 'search' | 'mail'

const ICONS: Record<IconKey, LucideIcon> = {
  work: Briefcase,
  group: Users,
  search: UserSearch,
  mail: Mail,
}

type Props = {
  icon: IconKey
  iconColor: string
  label: string
  value: number | string
  trend?: number
  trendLabel?: string
  href?: string
}

export function StatCard({
  icon,
  iconColor,
  label,
  value,
  trend,
  trendLabel,
  href,
}: Props) {
  const Icon = ICONS[icon]
  const isPositive = (trend ?? 0) >= 0
  const trendText = trend === undefined ? null : `${isPositive ? '+' : ''}${trend}%`

  const inner = (
    <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-5 hover:shadow-[0_8px_24px_rgba(183,0,17,0.06)] hover:-translate-y-0.5 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-lg ${iconColor} flex items-center justify-center`}>
          <Icon className="w-5 h-5" />
        </div>
        {trendText && (
          <span
            className={
              isPositive
                ? 'inline-flex items-center gap-0.5 font-mono text-[10px] font-bold text-emerald-600'
                : 'inline-flex items-center gap-0.5 font-mono text-[10px] font-bold text-error'
            }
          >
            {isPositive ? (
              <TrendingUp className="w-3.5 h-3.5" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5" />
            )}
            {trendText}
          </span>
        )}
      </div>

      <div className="text-3xl font-extrabold text-on-surface tracking-tight leading-none">
        {typeof value === 'number' ? value.toLocaleString('id-ID') : value}
      </div>
      <div className="text-[13px] text-on-surface-variant mt-1.5">{label}</div>
      {trendLabel && (
        <div className="font-mono text-[10px] text-on-surface-variant/70 mt-2">
          {trendLabel}
        </div>
      )}
    </div>
  )

  if (href) return <Link href={href}>{inner}</Link>
  return inner
}