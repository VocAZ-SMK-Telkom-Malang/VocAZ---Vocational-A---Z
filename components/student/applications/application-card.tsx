// components/student/applications/application-card.tsx
'use client'

import Link from 'next/link'
import {
  MapPin,
  Clock,
  Calendar,
  MessageSquare,
  MoreVertical,
  ExternalLink,
  TrendingUp,
  User,
  Trash2,
  Eye,
} from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import {
  formatSalary,
  formatRelativeDate,
  type Application,
} from './types'
import { StatusBadge } from './status-badge'
import { ApplicationTimeline } from './application-timeline'

type Props = {
  app: Application
  onWithdraw?: (id: string) => void
}

export function ApplicationCard({ app, onWithdraw }: Props) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const initials = app.companyName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const canWithdraw = ['submitted', 'reviewed', 'shortlisted'].includes(app.status)

  const matchColor =
    app.matchScore >= 85
      ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
      : app.matchScore >= 70
        ? 'text-amber-700 bg-amber-50 border-amber-200'
        : 'text-rose-700 bg-rose-50 border-rose-200'

  return (
    <div className="group relative flex flex-col p-5 bg-surface-container-lowest rounded-2xl border border-outline-variant/30 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all">
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-sm shrink-0 shadow-sm"
          style={{ backgroundColor: app.companyLogoColor }}
        >
          {initials}
        </div>

        <div className="flex-1 min-w-0">
          <Link
            href={`/student/jobs/${app.jobSlug}`}
            className="text-base font-bold text-on-surface leading-snug line-clamp-2 hover:text-primary transition-colors"
          >
            {app.jobTitle}
          </Link>
          <Link
            href={`/student/companies/${app.companySlug}`}
            className="text-sm text-on-surface-variant truncate hover:text-primary transition-colors mt-0.5 block"
          >
            {app.companyName}
          </Link>
        </div>

        {/* Menu */}
        <div className="relative shrink-0" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors"
            aria-label="Menu"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-1 w-48 bg-surface-container-lowest rounded-xl shadow-lg ring-1 ring-outline-variant/30 overflow-hidden z-30">
              <Link
                href={`/student/jobs/${app.jobSlug}`}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-on-surface hover:bg-surface-container transition-colors"
              >
                <Eye className="w-3.5 h-3.5 text-on-surface-variant" />
                Lihat Lowongan
              </Link>
              <Link
                href={`/student/messages?company=${app.companySlug}`}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-on-surface hover:bg-surface-container transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5 text-on-surface-variant" />
                Chat Recruiter
              </Link>
              {canWithdraw && onWithdraw && (
                <>
                  <div className="h-px bg-outline-variant/30" />
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false)
                      onWithdraw(app.id)
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors text-left"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Tarik Lamaran
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-1.5 mb-3">
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-surface-container text-[10px] font-medium text-on-surface-variant">
          <MapPin className="w-2.5 h-2.5" />
          {app.jobLocation}
        </span>
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-surface-container text-[10px] font-medium text-on-surface-variant">
          <Clock className="w-2.5 h-2.5" />
          {app.jobType}
        </span>
        <span
          className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-semibold ${
            app.jobMode === 'Remote'
              ? 'bg-emerald-50 text-emerald-700'
              : app.jobMode === 'Hybrid'
                ? 'bg-amber-50 text-amber-700'
                : 'bg-blue-50 text-blue-700'
          }`}
        >
          {app.jobMode}
        </span>
        <span className="inline-flex items-center px-2 py-1 rounded-md bg-emerald-50 text-[10px] font-semibold text-emerald-700">
          💰 {formatSalary(app.salaryMin, app.salaryMax)}
        </span>
      </div>

      {/* Status + Match */}
      <div className="flex items-center flex-wrap gap-2 mb-4">
        <StatusBadge status={app.status} />
        <span
          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full border text-[10px] font-bold ${matchColor}`}
        >
          <TrendingUp className="w-3 h-3" />
          Match {app.matchScore}%
        </span>
      </div>

      {/* Next step */}
      {app.nextStep && (
        <div className="mb-4 p-2.5 rounded-lg bg-primary/5 border border-primary/15">
          <p className="text-[10px] font-bold uppercase tracking-wider text-primary mb-0.5">
            Langkah Berikutnya
          </p>
          <p className="text-xs font-semibold text-on-surface">{app.nextStep}</p>
          {app.interviewDate && (
            <p className="text-[10px] text-on-surface-variant mt-1 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {new Date(app.interviewDate).toLocaleString('id-ID', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          )}
          {app.recruiterName && (
            <p className="text-[10px] text-on-surface-variant mt-1 flex items-center gap-1">
              <User className="w-3 h-3" />
              Recruiter: {app.recruiterName}
            </p>
          )}
        </div>
      )}

      {/* Timeline */}
      <div className="mb-4 p-3 rounded-xl bg-surface-container-low/50 border border-outline-variant/20">
        <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-2">
          Timeline
        </p>
        <ApplicationTimeline status={app.status} timeline={app.timeline} />
      </div>

      {/* Footer */}
      <div className="mt-auto pt-3 border-t border-outline-variant/20 flex items-center justify-between">
        <span className="text-[10px] text-on-surface-variant">
          Dilamar {formatRelativeDate(app.appliedAt)}
        </span>
        <Link
          href={`/student/applications/${app.id}`}
          className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline underline-offset-4"
        >
          Detail
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>
    </div>
  )
}