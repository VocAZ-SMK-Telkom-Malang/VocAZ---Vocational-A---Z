// components/student/saved/saved-client-view.tsx
'use client'

import { useMemo, useState, useEffect, useTransition } from 'react'
import {
  Search,
  X,
  Bookmark,
  Briefcase,
  Building2,
  RefreshCw,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'
import { SavedJobCard } from './saved-job-card'
import { SavedCompanyCard } from './saved-company-card'
import { SavedEmpty } from './saved-empty'
import {
  type SavedJob,
  type SavedCompany,
  type SavedTab,
} from './types'
import { unsaveJob, unsaveCompany, clearAllSaved } from '@/app/actions/saved'

type Stats = {
  savedJobs: number
  savedCompanies: number
}

type Props = {
  initialSavedJobs: SavedJob[]
  initialSavedCompanies: SavedCompany[]
  initialStats: Stats
  studentUserId: string
}

const PAGE_SIZE = 6

export function SavedClientView({
  initialSavedJobs,
  initialSavedCompanies,
  initialStats,
  studentUserId,
}: Props) {
  const [tab, setTab] = useState<SavedTab>('jobs')
  const [savedJobs, setSavedJobs] = useState(initialSavedJobs)
  const [savedCompanies, setSavedCompanies] = useState(initialSavedCompanies)
  const [stats, setStats] = useState(initialStats)
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [isPending, startTransition] = useTransition()

  // Sync dari server
  useEffect(() => {
    setSavedJobs(initialSavedJobs)
    setSavedCompanies(initialSavedCompanies)
    setStats(initialStats)
  }, [initialSavedJobs, initialSavedCompanies, initialStats])

  // ============================================
  // FILTER
  // ============================================
  const filteredJobs = useMemo(() => {
    if (!query) return savedJobs
    const q = query.toLowerCase()
    return savedJobs.filter(
      (j) =>
        j.jobTitle.toLowerCase().includes(q) ||
        j.companyName.toLowerCase().includes(q) ||
        j.jobLocation.toLowerCase().includes(q) ||
        j.skills.some((s) => s.toLowerCase().includes(q))
    )
  }, [savedJobs, query])

  const filteredCompanies = useMemo(() => {
    if (!query) return savedCompanies
    const q = query.toLowerCase()
    return savedCompanies.filter(
      (c) =>
        c.companyName.toLowerCase().includes(q) ||
        c.industry.toLowerCase().includes(q) ||
        c.tagline.toLowerCase().includes(q) ||
        c.location.toLowerCase().includes(q)
    )
  }, [savedCompanies, query])

  const currentList = tab === 'jobs' ? filteredJobs : filteredCompanies
  const totalPages = Math.max(1, Math.ceil(currentList.length / PAGE_SIZE))
  const startIndex = (page - 1) * PAGE_SIZE
  const endIndex = Math.min(startIndex + PAGE_SIZE, currentList.length)
  const paginated = currentList.slice(startIndex, endIndex)

  useEffect(() => {
    setPage(1)
  }, [tab, query])

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

  // ============================================
  // HANDLERS
  // ============================================
  function handleUnsaveJob(id: string) {
    startTransition(async () => {
      setSavedJobs((prev) => prev.filter((j) => j.id !== id))
      setStats((s) => ({ ...s, savedJobs: Math.max(0, s.savedJobs - 1) }))

      const res = await unsaveJob(id)
      if (!res.success) {
        alert(res.error || 'Gagal menghapus')
        setSavedJobs(initialSavedJobs)
        setStats(initialStats)
      }
    })
  }

  function handleUnsaveCompany(id: string) {
    startTransition(async () => {
      setSavedCompanies((prev) => prev.filter((c) => c.id !== id))
      setStats((s) => ({ ...s, savedCompanies: Math.max(0, s.savedCompanies - 1) }))

      const res = await unsaveCompany(id)
      if (!res.success) {
        alert(res.error || 'Gagal menghapus')
        setSavedCompanies(initialSavedCompanies)
        setStats(initialStats)
      }
    })
  }

  function handleClearAll() {
    if (
      !confirm(
        `Hapus SEMUA ${tab === 'jobs' ? 'lowongan' : 'perusahaan'} tersimpan?`
      )
    )
      return

    startTransition(async () => {
      if (tab === 'jobs') {
        setSavedJobs([])
        setStats((s) => ({ ...s, savedJobs: 0 }))
      } else {
        setSavedCompanies([])
        setStats((s) => ({ ...s, savedCompanies: 0 }))
      }

      const res = await clearAllSaved(studentUserId, tab)
      if (!res.success) {
        alert(res.error || 'Gagal menghapus')
        setSavedJobs(initialSavedJobs)
        setSavedCompanies(initialSavedCompanies)
        setStats(initialStats)
      }
    })
  }

  const currentCount = currentList.length
  const tabCounts = {
    jobs: savedJobs.length,
    companies: savedCompanies.length,
  }

  return (
    <div className="space-y-6">
      {/* ============================================ */}
      {/* HERO                                          */}
      {/* ============================================ */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-50/60 via-surface-container-lowest to-surface-container-lowest border border-outline-variant/30 p-6 sm:p-8">
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-16 w-72 h-72 rounded-full bg-primary/5 blur-3xl pointer-events-none" />

        <div className="relative">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-[11px] font-bold uppercase tracking-wider mb-3">
            <Bookmark className="w-3 h-3 fill-current" />
            Bookmark
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-on-surface tracking-tight leading-tight">
                Tersimpan
              </h1>
              <p className="text-sm text-on-surface-variant mt-2 max-w-xl">
                Koleksi lowongan & perusahaan yang kamu simpan. Pantau terus
                biar ga kelewatan.
              </p>
            </div>
            {isPending && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-bold shrink-0">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Menyimpan...
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 mt-6 max-w-md">
            <StatBox
              icon={<Briefcase className="w-4 h-4" />}
              label="Lowongan Tersimpan"
              value={stats.savedJobs}
              accent="bg-primary/10 text-primary"
            />
            <StatBox
              icon={<Building2 className="w-4 h-4" />}
              label="Perusahaan Tersimpan"
              value={stats.savedCompanies}
              accent="bg-indigo-100 text-indigo-700"
            />
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* TABS + SEARCH                                 */}
      {/* ============================================ */}
      <div className="sticky top-16 z-20 -mx-4 sm:mx-0 px-4 sm:px-0 py-2 bg-[#FAF8F5]/80 backdrop-blur-md space-y-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          {/* Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
            <button
              type="button"
              onClick={() => setTab('jobs')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold transition-all shrink-0 ${
                tab === 'jobs'
                  ? 'bg-primary text-white shadow-md shadow-primary/20'
                  : 'bg-surface-container-lowest border border-outline-variant/30 text-on-surface-variant hover:bg-surface-container hover:border-primary/30'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              Lowongan
              <span
                className={`min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-black flex items-center justify-center ${
                  tab === 'jobs'
                    ? 'bg-white/25 text-white'
                    : 'bg-surface-container text-on-surface-variant'
                }`}
              >
                {tabCounts.jobs}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setTab('companies')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold transition-all shrink-0 ${
                tab === 'companies'
                  ? 'bg-primary text-white shadow-md shadow-primary/20'
                  : 'bg-surface-container-lowest border border-outline-variant/30 text-on-surface-variant hover:bg-surface-container hover:border-primary/30'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              Perusahaan
              <span
                className={`min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-black flex items-center justify-center ${
                  tab === 'companies'
                    ? 'bg-white/25 text-white'
                    : 'bg-surface-container text-on-surface-variant'
                }`}
              >
                {tabCounts.companies}
              </span>
            </button>
          </div>

          {/* Clear All */}
          {currentCount > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              disabled={isPending}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 hover:bg-rose-100 transition-colors disabled:opacity-50"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Hapus Semua
            </button>
          )}
        </div>

        {/* Search */}
        <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/5 transition-all shadow-sm">
          <Search className="w-4 h-4 text-on-surface-variant shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              tab === 'jobs'
                ? 'Cari lowongan, perusahaan, lokasi, atau skill...'
                : 'Cari perusahaan, industri, atau lokasi...'
            }
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

      {/* ============================================ */}
      {/* GRID / EMPTY                                  */}
      {/* ============================================ */}
      {currentCount === 0 && !query ? (
        <SavedEmpty variant="empty" tab={tab} />
      ) : currentCount === 0 && query ? (
        <SavedEmpty variant="no-results" tab={tab} onReset={() => setQuery('')} />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {tab === 'jobs'
              ? (paginated as SavedJob[]).map((j) => (
                  <SavedJobCard key={j.id} job={j} onUnsave={handleUnsaveJob} />
                ))
              : (paginated as SavedCompany[]).map((c) => (
                  <SavedCompanyCard
                    key={c.id}
                    company={c}
                    onUnsave={handleUnsaveCompany}
                  />
                ))}
          </div>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pt-6 border-t border-outline-variant/30">
              <p className="text-xs text-on-surface-variant">
                Menampilkan{' '}
                <span className="font-bold text-on-surface">
                  {startIndex + 1}–{endIndex}
                </span>{' '}
                dari{' '}
                <span className="font-bold text-on-surface">{currentCount}</span>{' '}
                {tab === 'jobs' ? 'lowongan' : 'perusahaan'}
              </p>

              <nav
                className="flex items-center justify-center gap-1"
                aria-label="Pagination"
              >
                <button
                  type="button"
                  onClick={() => setPage(1)}
                  disabled={page === 1}
                  className="hidden sm:flex w-9 h-9 items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  aria-label="Halaman pertama"
                >
                  <ChevronsLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className="flex w-9 h-9 items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  aria-label="Halaman sebelumnya"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {getPageNumbers().map((n, i) =>
                  n === '...' ? (
                    <span
                      key={`e-${i}`}
                      className="w-9 h-9 flex items-center justify-center text-on-surface-variant text-sm select-none"
                    >
                      …
                    </span>
                  ) : (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setPage(n)}
                      aria-current={n === page ? 'page' : undefined}
                      className={`min-w-[36px] h-9 px-2.5 flex items-center justify-center rounded-lg text-sm font-bold transition-all ${
                        n === page
                          ? 'bg-primary text-white shadow-sm shadow-primary/30'
                          : 'text-on-surface hover:bg-surface-container'
                      }`}
                    >
                      {n}
                    </button>
                  )
                )}

                <button
                  type="button"
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPages}
                  className="flex w-9 h-9 items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  aria-label="Halaman berikutnya"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setPage(totalPages)}
                  disabled={page === totalPages}
                  className="hidden sm:flex w-9 h-9 items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  aria-label="Halaman terakhir"
                >
                  <ChevronsRight className="w-4 h-4" />
                </button>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  )
}

// ============================================
// SUB-COMPONENTS
// ============================================

function StatBox({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode
  label: string
  value: number
  accent: string
}) {
  return (
    <div className="flex items-center gap-3 p-3.5 rounded-xl bg-surface-container-lowest/80 backdrop-blur-sm border border-outline-variant/30">
      <div
        className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${accent}`}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xl font-black text-on-surface leading-none">
          {value}
        </p>
        <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mt-1">
          {label}
        </p>
      </div>
    </div>
  )
}