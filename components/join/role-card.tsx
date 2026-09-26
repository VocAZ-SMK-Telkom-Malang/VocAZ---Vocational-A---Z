import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

type Props = {
  href: string
  title: string
  description: string
  icon: LucideIcon
  iconBg: string
  iconColor: string
}

export function RoleCard({
  href,
  title,
  description,
  icon: Icon,
  iconBg,
  iconColor,
}: Props) {
  return (
    <Link
      href={href}
      className="group flex items-start gap-4 p-5 rounded-2xl bg-white ring-1 ring-outline-variant/30 hover:ring-primary/40 hover:bg-[#FFF8F5] hover:shadow-[0_12px_32px_-8px_rgba(220,38,38,0.15)] transition-all"
    >
      {/* Icon */}
      <div
        className={`w-12 h-12 rounded-xl ${iconBg} ${iconColor} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}
      >
        <Icon className="w-6 h-6" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <h3 className="font-display text-base font-bold text-on-surface group-hover:text-primary transition-colors">
            {title}
          </h3>
          <ArrowRight className="w-4 h-4 text-on-surface-variant group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
        </div>
        <p className="text-xs text-on-surface-variant leading-relaxed">
          {description}
        </p>
      </div>
    </Link>
  )
}