// components/company/jobs/jobs-table-row.tsx
'use client'

import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import {
  MoreVertical,
  Eye,
  Edit,
  Copy,
  Power,
  Trash2,
  ExternalLink,
  MapPin,
  Clock,
} from 'lucide-react'
import { JobStatusBadge } from './job-status-badge'
import type { JobListItem } from '@/lib/queries/company-jobs'

const EMPLOYMENT_LABEL: Record<string, string> = {
  internship: 'Internship',
  part_time: 'Part Time',
  full_time: 'Full Time',
  freelance: 'Freelance',
  volunteer: 'Volunteer',
  contract: 'Contract',
}

type Props = {
  job: JobListItem
}

export function JobsTableRow({ job }: Props) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    if (menuOpen) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [menuOpen])

  const formatDate = (iso: string | null) => {
    if (!iso) return '-'
    return new Date(iso).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  const deadlineLabel = () => {
    if (!job.expiredAt) return '-'
    if (job.isExpired) return 'Expired'
    if (job.daysLeft !== null && job.daysLeft <= 3) {
      return `${job.daysLeft} hari lagi`
    }
    return formatDate(job.expiredAt)
  }

  return (
    <tr className="border-b border-outline-variant/20 hover:bg-surface-container-low/40 transition-colors">
      {/* Position */}
      <td className="px-4 py-4 align-top">
        <Link
          href={`/company/jobs/${job.id}`}
          className="text-sm font-bold text-on-surface hover:text-primary transition-colors line-clamp-1"
        >
          {job.title}
        </Link>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1 text-[11px] text-on-surface-variant">
          <span className="inline-flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {job.city ?? job.location ?? 'Indonesia'}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {EMPLOYMENT_LABEL[job.employmentType] ?? job.employmentType}
          </span>
        </div>
      </td>

      {/* Applicants */}
      <td className="px-4 py-4 align-top">
        <div className="flex flex-col gap-1.5 min-w-[140px]">
          <div className="flex items-baseline gap-1">
            <span className="text-base font-extrabold text-on-surface">
              {job.totalApplicants}
            </span>
            <span className="text-[11px] text-on-surface-variant">
              Pelamar
            </span>
          </div>

          {job.totalApplicants > 0 && (
            <>
              {/* Progress bar */}
              <div className="w-full h-1.5 rounded-full bg-surface-container overflow-hidden flex">
                <div
                  className="h-full bg-emerald-500"
                  style={{
                    width: `${(job.newApplicants / job.totalApplicants) * 100}%`,
                  }}
                />
                <div
                  className="h-full bg-primary"
                  style={{
                    width: `${
                      (job.shortlisted / job.totalApplicants) * 100
                    }%`,
                  }}
                />
              </div>

              {/* Legend */}
              <div className="flex items-center gap-2 text-[10px] font-mono">
                <span className="inline-flex items-center gap-1 text-on-surface-variant">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  {job.newApplicants} New
                </span>
                <span className="inline-flex items-center gap-1 text-on-surface-variant">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  {job.shortlisted} Shortlisted
                </span>
              </div>
            </>
          )}
        </div>
      </td>

      {/* Deadline */}
      <td className="px-4 py-4 align-top">
        <div
          className={
            job.isExpired
              ? 'text-sm font-semibold text-error'
              : job.daysLeft !== null && job.daysLeft <= 3
              ? 'text-sm font-semibold text-amber-600'
              : 'text-sm font-medium text-on-surface-variant'
          }
        >
          {deadlineLabel()}
        </div>
      </td>

      {/* Status */}
      <td className="px-4 py-4 align-top">
        <JobStatusBadge status={job.status} />
      </td>

      {/* Actions */}
      <td className="px-4 py-4 align-top text-right">
        <div className="flex items-center justify-end gap-2">
          <Link
            href={`/company/jobs/${job.id}/applicants`}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-primary hover:bg-primary/10 text-xs font-bold transition-colors"
          >
            Lihat Pelamar
            <ExternalLink className="w-3 h-3" />
          </Link>

          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="w-8 h-8 rounded-lg hover:bg-surface-container flex items-center justify-center text-on-surface-variant transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-lg overflow-hidden z-20">
                <Link
                  href={`/company/jobs/${job.id}`}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-surface-container text-sm text-on-surface transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  <Eye className="w-4 h-4" />
                  Lihat Detail
                </Link>
                <Link
                  href={`/company/jobs/${job.id}/edit`}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-surface-container text-sm text-on-surface transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  <Edit className="w-4 h-4" />
                  Edit Lowongan
                </Link>
                <button
                  type="button"
                  className="w-full flex items-center gap-2 px-3 py-2 hover:bg-surface-container text-sm text-on-surface transition-colors"
                >
                  <Copy className="w-4 h-4" />
                  Duplikat
                </button>
                <button
                  type="button"
                  className="w-full flex items-center gap-2 px-3 py-2 hover:bg-surface-container text-sm text-on-surface transition-colors"
                >
                  <Power className="w-4 h-4" />
                  {job.status === 'active' ? 'Tutup Lowongan' : 'Aktifkan'}
                </button>
                <div className="border-t border-outline-variant/30" />
                <button
                  type="button"
                  className="w-full flex items-center gap-2 px-3 py-2 hover:bg-error/5 text-sm text-error transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Hapus
                </button>
              </div>
            )}
          </div>
        </div>
      </td>
    </tr>
  )
}