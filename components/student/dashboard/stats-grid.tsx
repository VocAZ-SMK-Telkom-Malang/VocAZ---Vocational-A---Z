// components/student/dashboard/stats-grid.tsx
import Link from 'next/link'
import { Briefcase, Bookmark, Video, Award, ArrowUpRight } from 'lucide-react'

type Props = {
  stats: {
    activeApplications: number
    savedJobs: number
    showcaseVideos: number
    certificates: number
  }
}

const STAT_CONFIG = [
  {
    key: 'activeApplications' as const,
    label: 'Lamaran Aktif',
    href: '/student/applications',
    icon: Briefcase,
    color: 'blue',
  },
  {
    key: 'savedJobs' as const,
    label: 'Lowongan Tersimpan',
    href: '/student/saved',
    icon: Bookmark,
    color: 'amber',
  },
  {
    key: 'showcaseVideos' as const,
    label: 'Video Showcase',
    href: '/student/showcase/my',
    icon: Video,
    color: 'purple',
  },
  {
    key: 'certificates' as const,
    label: 'Sertifikat',
    href: '/student/profile/certifications',
    icon: Award,
    color: 'emerald',
  },
]

const COLOR_MAP: Record<string, { bg: string; text: string }> = {
  blue: { bg: 'bg-blue-100', text: 'text-blue-700' },
  amber: { bg: 'bg-amber-100', text: 'text-amber-700' },
  purple: { bg: 'bg-purple-100', text: 'text-purple-700' },
  emerald: { bg: 'bg-emerald-100', text: 'text-emerald-700' },
}

export function StatsGrid({ stats }: Props) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {STAT_CONFIG.map((config) => {
        const Icon = config.icon
        const value = stats[config.key]
        const colors = COLOR_MAP[config.color]

        return (
          <Link
            key={config.key}
            href={config.href}
            className="group bg-white rounded-2xl ring-1 ring-outline-variant/30 p-5 hover:ring-primary/30 hover:shadow-[0_8px_24px_rgba(183,0,17,0.06)] transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className={`w-10 h-10 rounded-xl ${colors.bg} ${colors.text} flex items-center justify-center`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-on-surface-variant group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </div>
            <p className="font-display text-2xl font-extrabold text-on-surface mb-0.5">
              {value}
            </p>
            <p className="text-xs text-on-surface-variant">{config.label}</p>
          </Link>
        )
      })}
    </div>
  )
}