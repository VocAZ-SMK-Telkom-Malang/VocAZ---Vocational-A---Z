// components/company/jobs/detail/job-applicants-tab.tsx
'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Search, Filter, BadgeCheck, Zap, ChevronRight } from 'lucide-react'
import type { JobApplicant } from '@/lib/queries/company-job-detail'

const STATUS_LABEL: Record<string, { label: string; style: string }> = {
  submitted: { label: 'Baru', style: 'bg-blue-50 text-blue-700 border-blue-200' },
  reviewed: {
    label: 'Ditinjau',
    style: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  shortlisted: {
    label: 'Shortlist',
    style: 'bg-purple-50 text-purple-700 border-purple-200',
  },
  interview: {
    label: 'Interview',
    style: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  },
  offered: {
    label: 'Ditawari',
    style: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  hired: {
    label: 'Diterima',
    style: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  },
  rejected: { label: 'Ditolak', style: 'bg-error/10 text-error border-error/20' },
  withdrawn: {
    label: 'Batal',
    style: 'bg-surface-container text-on-surface-variant border-outline-variant',
  },
}

const FILTER_TABS = [
  { key: 'all', label: 'Semua' },
  { key: 'submitted', label: 'Baru' },
  { key: 'shortlisted', label: 'Shortlist' },
  { key: 'interview', label: 'Interview' },
  { key: 'hired', label: 'Diterima' },
  { key: 'rejected', label: 'Ditolak' },
]

export function JobApplicantsTab({
  jobId,
  applicants,
}: {
  jobId: string
  applicants: JobApplicant[]
}) {
  const [activeFilter, setActiveFilter] = useState('all')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    return applicants.filter((a) => {
      if (activeFilter !== 'all' && a.status !== activeFilter) return false
      if (search) {
        const q = search.toLowerCase()
        return (
          a.name.toLowerCase().includes(q) ||
          (a.school?.toLowerCase() ?? '').includes(q) ||
          (a.headline?.toLowerCase() ?? '').includes(q)
        )
      }
      return true
    })
  }, [applicants, activeFilter, search])

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: applicants.length }
    for (const a of applicants) {
      c[a.status] = (c[a.status] ?? 0) + 1
    }
    return c
  }, [applicants])

  return (
    <div className="flex flex-col gap-4">
      {/* Search + Filter */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari pelamar..."
            className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/40 focus:border-primary/30 focus:outline-none text-sm transition"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1">
        {FILTER_TABS.map((tab) => {
          const isActive = activeFilter === tab.key
          const count = counts[tab.key] ?? 0
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveFilter(tab.key)}
              className={`
                inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors
                ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'bg-surface-container-lowest text-on-surface-variant border border-outline-variant/40 hover:bg-surface-container'
                }
              `}
            >
              {tab.label}
              <span
                className={`px-1.5 rounded-md font-mono text-[10px] ${
                  isActive
                    ? 'bg-white/20'
                    : 'bg-surface-container text-on-surface-variant'
                }`}
              >
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 py-12 text-center">
          <Filter className="w-10 h-10 text-on-surface-variant/40 mx-auto mb-3" />
          <p className="text-sm text-on-surface-variant">
            {applicants.length === 0
              ? 'Belum ada pelamar untuk lowongan ini'
              : 'Tidak ada pelamar yang cocok dengan filter'}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map((a) => {
            const statusCfg = STATUS_LABEL[a.status] ?? STATUS_LABEL.submitted
            return (
              <Link
                key={a.applicationId}
                href={`/company/pipeline/${a.applicationId}`}
                className="group bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-4 hover:border-primary/30 hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  {a.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={a.avatarUrl}
                      alt={a.name}
                      className="w-12 h-12 rounded-full object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-fixed to-tertiary-fixed flex items-center justify-center text-primary font-bold shrink-0">
                      {a.initials}
                    </div>
                  )}

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="text-sm font-bold text-on-surface truncate group-hover:text-primary transition-colors">
                        {a.name}
                      </h3>
                      {a.isVerified && (
                        <BadgeCheck className="w-4 h-4 text-primary shrink-0" />
                      )}
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-md border font-mono text-[10px] font-bold ${statusCfg.style}`}
                      >
                        {statusCfg.label}
                      </span>
                    </div>

                    <p className="text-xs text-on-surface-variant mt-0.5 truncate">
                      {a.headline ?? a.school ?? 'Siswa SMK'}
                    </p>

                    {/* Skills + badges */}
                    <div className="flex flex-wrap items-center gap-1.5 mt-2">
                      {a.skills.slice(0, 3).map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-0.5 rounded-md bg-surface-container text-on-surface-variant font-mono text-[10px]"
                        >
                          {skill}
                        </span>
                      ))}
                      {a.matchScore !== null && (
                        <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-mono text-[10px] font-bold">
                          <Zap className="w-3 h-3" />
                          {a.matchScore}%
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right */}
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right hidden md:block">
                      <div className="font-mono text-[10px] text-on-surface-variant">
                        {a.appliedAtRelative}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-on-surface-variant/40 group-hover:text-primary transition-colors" />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}