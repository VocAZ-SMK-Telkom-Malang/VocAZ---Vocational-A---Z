// components/student/dashboard/recent-applications.tsx
import Link from 'next/link'
import { ArrowRight, Send } from 'lucide-react'

type Application = {
  id: string
  status: string
  appliedAt: Date
  job: {
    id: string
    title: string
    slug: string
    company: {
      id: string
      name: string
      slug: string
      logoUrl: string | null
    }
  }
}

type Props = {
  applications: Application[]
}

const STATUS_CONFIG: Record<
  string,
  { label: string; bg: string; text: string }
> = {
  submitted: { label: 'Terkirim', bg: 'bg-blue-100', text: 'text-blue-700' },
  reviewed: { label: 'Ditinjau', bg: 'bg-amber-100', text: 'text-amber-700' },
  shortlisted: {
    label: 'Shortlist',
    bg: 'bg-purple-100',
    text: 'text-purple-700',
  },
  interview: {
    label: 'Interview',
    bg: 'bg-indigo-100',
    text: 'text-indigo-700',
  },
  offered: { label: 'Ditawari', bg: 'bg-emerald-100', text: 'text-emerald-700' },
  hired: { label: 'Diterima', bg: 'bg-emerald-100', text: 'text-emerald-700' },
  rejected: { label: 'Ditolak', bg: 'bg-red-100', text: 'text-red-700' },
  withdrawn: {
    label: 'Dibatalkan',
    bg: 'bg-gray-100',
    text: 'text-gray-700',
  },
}

export function RecentApplications({ applications }: Props) {
  if (applications.length === 0) {
    return (
      <div className="bg-white rounded-2xl ring-1 ring-outline-variant/30 p-8 text-center">
        <div className="w-12 h-12 rounded-xl bg-surface-container mx-auto flex items-center justify-center mb-3">
          <Send className="w-6 h-6 text-on-surface-variant" />
        </div>
        <p className="text-sm font-semibold text-on-surface mb-1">
          Belum ada lamaran
        </p>
        <p className="text-xs text-on-surface-variant mb-4">
          Mulai lamar lowongan yang cocok denganmu.
        </p>
        <Link
          href="/student/jobs"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:gap-2 transition-all"
        >
          <span>Cari lowongan</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {applications.map((app) => {
        const status = STATUS_CONFIG[app.status] || STATUS_CONFIG.submitted
        return (
          <Link
            key={app.id}
            href={`/student/applications/${app.id}`}
            className="group flex items-center gap-3 p-3 rounded-xl hover:bg-surface-container-low transition-colors"
          >
            <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center shrink-0 overflow-hidden">
              {app.job.company.logoUrl ? (
                <img
                  src={app.job.company.logoUrl}
                  alt={app.job.company.name}
                  className="w-full h-full object-contain"
                />
              ) : (
                <span className="text-xs font-bold text-on-surface-variant">
                  {app.job.company.name[0]}
                </span>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-on-surface truncate group-hover:text-primary transition-colors">
                {app.job.title}
              </p>
              <p className="text-xs text-on-surface-variant truncate">
                {app.job.company.name}
              </p>
            </div>

            <span
              className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0 ${status.bg} ${status.text}`}
            >
              {status.label}
            </span>
          </Link>
        )
      })}
    </div>
  )
}