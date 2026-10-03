// app/company/jobs/[id]/applicants/applicants-list-client.tsx
'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import {
  Search,
  BadgeCheck,
  Zap,
  ChevronRight,
  Users,
  Inbox,
  Eye,
} from 'lucide-react'
import type { JobDetail, JobApplicant } from '@/lib/queries/company-job-detail'
import { MatchScoreBadge } from '@/components/company/applicants/match-score-badge'

const STATUS_LABEL: Record<string, { label: string; style: string }> = {
  submitted: { label: 'Baru', style: 'bg-blue-50 text-blue-700 border-blue-200' },
  reviewed: { label: 'Ditinjau', style: 'bg-amber-50 text-amber-700 border-amber-200' },
  shortlisted: { label: 'Shortlist', style: 'bg-purple-50 text-purple-700 border-purple-200' },
  interview: { label: 'Interview', style: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  offered: { label: 'Ditawari', style: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  hired: { label: 'Diterima', style: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  rejected: { label: 'Ditolak', style: 'bg-error/10 text-error border-error/20' },
  withdrawn: { label: 'Dicabut', style: 'bg-surface-container text-on-surface-variant border-outline-variant' },
}

const FILTER_TABS = [
  { key: 'all', label: 'Semua' },
  { key: 'submitted', label: 'Baru' },
  { key: 'reviewed', label: 'Ditinjau' },
  { key: 'shortlisted', label: 'Shortlist' },
  { key: 'interview', label: 'Interview' },
  { key: 'hired', label: 'Diterima' },
  { key: 'rejected', label: 'Ditolak' },
]

type Props = {
  job: JobDetail
  applicants: JobApplicant[]
}

export function ApplicantsListClient({ job, applicants }: Props) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [minScore, setMinScore] = useState(0)

  const filtered = useMemo(() => {
  return applicants.filter((a) => {
    if (filter !== 'all' && a.status !== filter) return false
    if (a.matchScore !== null && a.matchScore < minScore) return false  // ← TAMBAH
    if (search) {
      // ...
    }
    return true
  })
}, [applicants, filter, search, minScore])

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: applicants.length }
    for (const a of applicants) {
      c[a.status] = (c[a.status] ?? 0) + 1
    }
    return c
  }, [applicants])

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-2xl md:text-3xl font-black text-on-surface tracking-tight">
            Daftar Pelamar
          </h1>
          <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary font-mono text-xs font-bold">
            {applicants.length}
          </span>
        </div>
        <p className="text-sm text-on-surface-variant">
          Pelamar untuk posisi <strong>{job.title}</strong>
        </p>
      </div>

      {/* Search + Filter */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari nama, sekolah, atau headline..."
          className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/40 focus:border-primary/30 focus:outline-none text-sm transition"
        />
      </div>

      {/* Min Score Filter */}
<div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-surface-container-lowest border border-outline-variant/40">
  <span className="text-xs font-bold text-on-surface whitespace-nowrap">
    Min Match:
  </span>
  <input
    type="range"
    min={0}
    max={100}
    step={5}
    value={minScore}
    onChange={(e) => setMinScore(Number(e.target.value))}
    className="flex-1 accent-primary"
  />
  <span className="font-mono text-xs font-bold text-primary w-12 text-right">
    {minScore}%
  </span>
</div>

      {/* Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1">
        {FILTER_TABS.map((tab) => {
          const isActive = filter === tab.key
          const count = counts[tab.key] ?? 0
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setFilter(tab.key)}
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
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 py-16 text-center">
          <Inbox className="w-12 h-12 text-on-surface-variant/40 mx-auto mb-3" />
          <h3 className="text-base font-bold text-on-surface mb-1">
            {applicants.length === 0
              ? 'Belum ada pelamar'
              : 'Tidak ada pelamar cocok'}
          </h3>
          <p className="text-sm text-on-surface-variant">
            {applicants.length === 0
              ? 'Pelamar akan muncul di sini setelah ada yang melamar.'
              : 'Coba ubah filter atau kata kunci.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((a) => {
            const statusCfg = STATUS_LABEL[a.status] ?? STATUS_LABEL.submitted
            return (
              <Link
                key={a.applicationId}
                href={`/company/jobs/${job.id}/applicants/${a.applicationId}`}
                className="group relative bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all"
              >
                {a.matchScore !== null && (
                  <div className="absolute top-3 right-3">
                    <MatchScoreBadge score={a.matchScore} size="sm" />
                  </div>
                )}
                {/* Header */}
                <div className="flex items-start gap-3 mb-3">
                  {a.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={a.avatarUrl}
                      alt={a.name}
                      className="w-12 h-12 rounded-full object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-fixed to-tertiary-fixed flex items-center justify-center text-primary font-bold text-sm shrink-0">
                      {a.initials}
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="text-sm font-bold text-on-surface truncate group-hover:text-primary transition-colors">
                        {a.name}
                      </h3>
                      {a.isVerified && (
                        <BadgeCheck className="w-3.5 h-3.5 text-primary shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-on-surface-variant truncate mt-0.5">
                      {a.headline ?? a.school ?? 'Siswa SMK'}
                    </p>
                  </div>
                </div>

                {/* Status */}
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-md border font-mono text-[10px] font-bold ${statusCfg.style}`}
                >
                  {statusCfg.label}
                </span>

                {/* Skills + badges */}
                <div className="flex flex-wrap items-center gap-1.5 mt-3">
                  {a.skills.slice(0, 2).map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-0.5 rounded-md bg-surface-container text-on-surface-variant font-mono text-[10px]"
                    >
                      {skill}
                    </span>
                  ))}
                  {a.skills.length > 2 && (
                    <span className="px-2 py-0.5 rounded-md bg-surface-container text-on-surface-variant font-mono text-[10px]">
                      +{a.skills.length - 2}
                    </span>
                  )}
                </div>

                {/* Footer */}
                <div className="mt-4 pt-3 border-t border-outline-variant/30 flex items-center justify-between">
                  <span className="font-mono text-[10px] text-on-surface-variant">
                    {a.appliedAtRelative}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-primary group-hover:underline">
                    Detail
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>

                {a.matchScore !== null && (
                  <div className="absolute top-3 right-3 inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-mono text-[10px] font-bold">
                    <Zap className="w-3 h-3" />
                    {a.matchScore}%
                  </div>
                )}
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}