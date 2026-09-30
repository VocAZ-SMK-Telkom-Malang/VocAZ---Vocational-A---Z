// components/student/applications/applications-client-view.tsx
'use client'

import { useMemo, useState, useEffect, useTransition } from 'react'
import {
  Search, X, Send, Eye, Mic, CheckCircle2,
  Briefcase, Inbox, ChevronLeft, ChevronRight,
  ChevronsLeft, ChevronsRight, RefreshCw,
} from 'lucide-react'
import { ApplicationCard } from './application-card'
import { ApplicationsEmpty } from './applications-empty'
import {
  isActiveStatus,
  isCompletedStatus,
  type Application,
} from './types'
import { withdrawApplication } from '@/app/actions/applications'

type Stats = {
  total: number
  active: number
  review: number
  interview: number
  offered: number
  hired: number
  rejected: number
}

type TabKey = 'all' | 'active' | 'interview' | 'completed'

const TABS: { key: TabKey; label: string }[] = [
  { key: 'all', label: 'Semua' },
  { key: 'active', label: 'Aktif' },
  { key: 'interview', label: 'Interview' },
  { key: 'completed', label: 'Selesai' },
]

const PAGE_SIZE_OPTIONS = [6, 9, 12, 18] as const

type Props = {
  initialApplications: Application[]
  initialStats: Stats
}

export function ApplicationsClientView({
  initialApplications,
  initialStats,
}: Props) {
  const [applications, setApplications] = useState(initialApplications)
  const [stats] = useState(initialStats)
  const [query, setQuery] = useState('')
  const [tab, setTab] = useState<TabKey>('all')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState<number>(6)
  const [isPending, startTransition] = useTransition()

  // Sync kalau data dari server berubah
  useEffect(() => {
    setApplications(initialApplications)
  }, [initialApplications])

  const filtered = useMemo(() => {
    return applications.filter((a) => {
      if (query) {
        const q = query.toLowerCase()
        const hit =
          a.jobTitle.toLowerCase().includes(q) ||
          a.companyName.toLowerCase().includes(q) ||
          a.jobLocation.toLowerCase().includes(q)
        if (!hit) return false
      }
      if (tab === 'active') return isActiveStatus(a.status)
      if (tab === 'interview') return a.status === 'interview'
      if (tab === 'completed') return isCompletedStatus(a.status)
      return true
    })
  }, [applications, query, tab])

  const sorted = useMemo(() => {
    return [...filtered].sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
  }, [filtered])

  useEffect(() => {
    setPage(1)
  }, [query, tab, pageSize])

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize))
  const startIndex = (page - 1) * pageSize
  const endIndex = Math.min(startIndex + pageSize, sorted.length)
  const paginated = sorted.slice(startIndex, endIndex)

  function getPageNumbers(): (number | '...')[] {
    const total = totalPages
    const current = page
    const delta = 1
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
    const range: (number | '...')[] = [1]
    const left = Math.max(2, current - delta)
    const right = Math.min(total - 1, current + delta)
    if (left > 2) range.push('...')
    for (let i = left; i <= right; i++) range.push(i)
    if (right < total - 1) range.push('...')
    range.push(total)
    return range
  }

  function handleWithdraw(id: string) {
    if (!confirm('Yakin mau tarik lamaran ini? Tindakan ini tidak bisa dibatalkan.'))
      return

    startTransition(async () => {
      // Optimistic update
      setApplications((prev) =>
        prev.map((a) =>
          a.id === id
            ? {
                ...a,
                status: 'withdrawn' as const,
                updatedAt: new Date().toISOString(),
                nextStep: undefined,
                timeline: [
                  ...a.timeline,
                  {
                    status: 'withdrawn' as const,
                    at: new Date().toISOString(),
                    note: 'Ditarik oleh kandidat',
                  },
                ],
              }
            : a
        )
      )

      const result = await withdrawApplication(id)
      if (!result.success) {
        alert(result.error || 'Gagal menarik lamaran')
        // Rollback dari server
        setApplications(initialApplications)
      }
    })
  }

  return (
    <div className="space-y-6">
      {/* HERO + STATS */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 via-surface-container-lowest to-surface-container-lowest border border-outline-variant/30 p-6 sm:p-8">
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-16 w-72 h-72 rounded-full bg-indigo-500/5 blur-3xl pointer-events-none" />

        <div className="relative">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-bold uppercase tracking-wider mb-3">
            <Inbox className="w-3 h-3" />
            Ekosistem Rekrutmen
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-on-surface tracking-tight leading-tight">
                Lamaran Saya
              </h1>
              <p className="text-sm text-on-surface-variant mt-2 max-w-xl">
                Pantau status lamaran kamu dari submit sampai diterima. Update
                real-time dari recruiter.
              </p>
            </div>
            {isPending && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-bold shrink-0">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Menyimpan...
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            <StatCard
              icon={<Briefcase className="w-4 h-4" />}
              label="Total Lamaran"
              value={stats.total}
              accent="bg-primary/10 text-primary"
            />
            <StatCard
              icon={<Eye className="w-4 h-4" />}
              label="Sedang Review"
              value={stats.review}
              accent="bg-amber-100 text-amber-700"
            />
            <StatCard
              icon={<Mic className="w-4 h-4" />}
              label="Interview"
              value={stats.interview}
              accent="bg-indigo-100 text-indigo-700"
            />
            <StatCard
              icon={<CheckCircle2 className="w-4 h-4" />}
              label="Diterima"
              value={stats.hired}
              accent="bg-emerald-100 text-emerald-700"
            />
          </div>
        </div>
      </div>

      {/* TABS + SEARCH */}
      <div className="sticky top-16 z-20 -mx-4 sm:mx-0 px-4 sm:px-0 py-2 bg-[#FAF8F5]/80 backdrop-blur-md space-y-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
          {TABS.map((t) => {
            const count =
              t.key === 'all'
                ? applications.length
                : t.key === 'active'
                  ? stats.active
                  : t.key === 'interview'
                    ? stats.interview
                    : applications.filter((a) => isCompletedStatus(a.status)).length
            const isActive = tab === t.key
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key)}
                className={`
                  inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold transition-all shrink-0
                  ${
                    isActive
                      ? 'bg-primary text-white shadow-md shadow-primary/20'
                      : 'bg-surface-container-lowest border border-outline-variant/30 text-on-surface-variant hover:bg-surface-container hover:border-primary/30'
                  }
                `}
              >
                {t.label}
                <span
                  className={`
                    min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-black flex items-center justify-center
                    ${isActive ? 'bg-white/25 text-white' : 'bg-surface-container text-on-surface-variant'}
                  `}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/5 transition-all shadow-sm">
          <Search className="w-4 h-4 text-on-surface-variant shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari posisi, perusahaan, atau lokasi..."
            className="flex-1 bg-transparent border-0 text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 rounded-full text-on-surface-variant hover:bg-surface-container transition-colors shrink-0"
              aria-label="Clear"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* GRID */}
      {applications.length === 0 ? (
        <ApplicationsEmpty variant="empty" />
      ) : sorted.length === 0 ? (
        <ApplicationsEmpty
          variant="no-results"
          onReset={() => {
            setQuery('')
            setTab('all')
          }}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {paginated.map((app) => (
              <ApplicationCard
                key={app.id}
                app={app}
                onWithdraw={handleWithdraw}
              />
            ))}
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pt-6 border-t border-outline-variant/30">
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <p className="text-xs text-on-surface-variant">
                Menampilkan{' '}
                <span className="font-bold text-on-surface">
                  {startIndex + 1}–{endIndex}
                </span>{' '}
                dari{' '}
                <span className="font-bold text-on-surface">{sorted.length}</span>{' '}
                lamaran
              </p>
              <div className="flex items-center gap-2">
                <label htmlFor="appPageSize" className="text-xs text-on-surface-variant font-medium">
                  Per halaman
                </label>
                <select
                  id="appPageSize"
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="text-xs font-bold bg-surface-container-lowest border border-outline-variant/30 rounded-lg px-2 py-1.5 text-on-surface hover:border-primary/40 focus:outline-none focus:border-primary/60 cursor-pointer"
                >
                  {PAGE_SIZE_OPTIONS.map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>
            </div>

            <nav className="flex items-center justify-center gap-1" aria-label="Pagination">
              <button type="button" onClick={() => setPage(1)} disabled={page === 1}
                className="hidden sm:flex w-9 h-9 items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                <ChevronsLeft className="w-4 h-4" />
              </button>
              <button type="button" onClick={() => setPage(page - 1)} disabled={page === 1}
                className="flex w-9 h-9 items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>

              {getPageNumbers().map((n, i) =>
                n === '...' ? (
                  <span key={`e-${i}`} className="w-9 h-9 flex items-center justify-center text-on-surface-variant text-sm select-none">
                    …
                  </span>
                ) : (
                  <button key={n} type="button" onClick={() => setPage(n)}
                    className={`min-w-[36px] h-9 px-2.5 flex items-center justify-center rounded-lg text-sm font-bold transition-all ${
                      n === page ? 'bg-primary text-white shadow-sm shadow-primary/30' : 'text-on-surface hover:bg-surface-container'
                    }`}>
                    {n}
                  </button>
                )
              )}

              <button type="button" onClick={() => setPage(page + 1)} disabled={page === totalPages}
                className="flex w-9 h-9 items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
              <button type="button" onClick={() => setPage(totalPages)} disabled={page === totalPages}
                className="hidden sm:flex w-9 h-9 items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                <ChevronsRight className="w-4 h-4" />
              </button>
            </nav>
          </div>
        </>
      )}
    </div>
  )
}

function StatCard({
  icon, label, value, accent,
}: {
  icon: React.ReactNode
  label: string
  value: number
  accent: string
}) {
  return (
    <div className="flex items-center gap-3 p-3.5 rounded-xl bg-surface-container-lowest/80 backdrop-blur-sm border border-outline-variant/30">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${accent}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xl font-black text-on-surface leading-none">{value}</p>
        <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mt-1">{label}</p>
      </div>
    </div>
  )
}