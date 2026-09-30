// app/student/jobs/jobs-client-view.tsx
'use client'

import { useMemo, useState, useEffect } from 'react'
import {
  Search,
  SlidersHorizontal,
  X,
  Briefcase,
  TrendingUp,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'
import { JobCard } from '@/components/student/jobs/job-card'
import { JobsEmpty } from '@/components/student/jobs/jobs-empty'
import { FilterDrawer } from '@/components/student/jobs/filter-drawer'
import {
  DEFAULT_FILTERS,
  type Job,
  type JobFilters,
} from '@/components/student/jobs/types'

const PAGE_SIZE_OPTIONS = [6, 9, 12, 18] as const

type Props = {
  initialJobs: Job[]
}

export function JobsClientView({ initialJobs }: Props) {
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState<JobFilters>(DEFAULT_FILTERS)
  const [filterOpen, setFilterOpen] = useState(false)
  const [jobs, setJobs] = useState<Job[]>(initialJobs)

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState<number>(9)

  // Sync kalau server data berubah
  useEffect(() => {
    setJobs(initialJobs)
  }, [initialJobs])

  // ============================================
  // FILTER LOGIC
  // ============================================
  const filtered = useMemo(() => {
    return jobs.filter((j) => {
      if (query) {
        const q = query.toLowerCase()
        const hit =
          j.title.toLowerCase().includes(q) ||
          j.company.toLowerCase().includes(q) ||
          j.skills.some((s) => s.toLowerCase().includes(q))
        if (!hit) return false
      }
      if (filters.location !== 'Semua Kota' && j.location !== filters.location) {
        return false
      }
      if (filters.types.length > 0 && !filters.types.includes(j.type)) {
        return false
      }
      if (filters.modes.length > 0 && !filters.modes.includes(j.mode)) {
        return false
      }
      return true
    })
  }, [jobs, query, filters])

  useEffect(() => {
    setPage(1)
  }, [query, filters, pageSize])

  // ============================================
  // PAGINATION
  // ============================================
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const startIndex = (page - 1) * pageSize
  const endIndex = Math.min(startIndex + pageSize, filtered.length)
  const paginated = filtered.slice(startIndex, endIndex)

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
  // ACTIVE CHIPS
  // ============================================
  const activeChips: { label: string; onRemove: () => void }[] = []
  if (filters.location !== 'Semua Kota') {
    activeChips.push({
      label: filters.location,
      onRemove: () => setFilters({ ...filters, location: 'Semua Kota' }),
    })
  }
  filters.types.forEach((t) =>
    activeChips.push({
      label: t,
      onRemove: () =>
        setFilters({ ...filters, types: filters.types.filter((x) => x !== t) }),
    })
  )
  filters.modes.forEach((m) =>
    activeChips.push({
      label: m,
      onRemove: () =>
        setFilters({ ...filters, modes: filters.modes.filter((x) => x !== m) }),
    })
  )

  return (
    <div className="space-y-6">
      {/* HERO */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 via-surface-container-lowest to-surface-container-lowest border border-outline-variant/30 p-6 sm:p-8">
        <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-16 w-72 h-72 rounded-full bg-primary/5 blur-3xl pointer-events-none" />

        <div className="relative">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3 h-3" />
            Career Hub
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-on-surface tracking-tight leading-tight">
                Cari Lowongan
              </h1>
              <p className="text-sm text-on-surface-variant mt-2 max-w-xl">
                Temukan lowongan yang cocok dengan skill & passion kamu. Update
                setiap hari dari mitra industri terpercaya.
              </p>
            </div>

            <div className="flex items-center gap-3 sm:gap-4 shrink-0">
              <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-surface-container-lowest/80 backdrop-blur-sm ring-1 ring-outline-variant/30">
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Briefcase className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-lg font-black text-on-surface leading-none">
                    {filtered.length}
                  </p>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant">
                    Lowongan
                  </p>
                </div>
              </div>

              <div className="hidden sm:flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-surface-container-lowest/80 backdrop-blur-sm ring-1 ring-outline-variant/30">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-lg font-black text-on-surface leading-none">
                    {jobs.filter((j) => j.companyVerified).length}
                  </p>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant">
                    Verified
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SEARCH + FILTER */}
      <div className="sticky top-16 z-20 -mx-4 sm:mx-0 px-4 sm:px-0 py-2 bg-[#FAF8F5]/80 backdrop-blur-md">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex-1 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/5 transition-all shadow-sm">
            <Search className="w-4 h-4 text-on-surface-variant shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari posisi, perusahaan, atau keyword..."
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

          <button
            type="button"
            onClick={() => setFilterOpen(true)}
            className={`
              relative flex items-center gap-2 px-4 py-3 rounded-2xl text-sm font-bold
              transition-all shrink-0 shadow-sm
              ${
                activeChips.length > 0
                  ? 'bg-primary text-white hover:bg-primary/90 shadow-primary/20'
                  : 'bg-surface-container-lowest border border-outline-variant/30 text-on-surface hover:bg-surface-container hover:border-primary/40'
              }
            `}
            aria-label="Buka filter"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">Filter</span>
            {activeChips.length > 0 && (
              <span className="ml-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-white/25 text-[10px] font-black flex items-center justify-center">
                {activeChips.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ACTIVE CHIPS */}
      {activeChips.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {activeChips.map((chip, i) => (
            <button
              key={i}
              type="button"
              onClick={chip.onRemove}
              className="group inline-flex items-center gap-1.5 pl-3 pr-2 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold hover:bg-primary/15 transition-colors ring-1 ring-primary/10"
            >
              {chip.label}
              <span className="w-4 h-4 rounded-full bg-primary/20 group-hover:bg-primary/30 flex items-center justify-center transition-colors">
                <X className="w-2.5 h-2.5" />
              </span>
            </button>
          ))}
          <button
            type="button"
            onClick={() => {
              setFilters(DEFAULT_FILTERS)
              setQuery('')
            }}
            className="text-xs font-bold text-on-surface-variant hover:text-primary transition-colors ml-1 underline-offset-4 hover:underline"
          >
            Reset semua
          </button>
        </div>
      )}

      {/* GRID */}
      {filtered.length === 0 ? (
        <JobsEmpty
          onReset={() => {
            setFilters(DEFAULT_FILTERS)
            setQuery('')
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {paginated.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}

      {/* PAGINATION */}
      {filtered.length > 0 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          pageSize={pageSize}
          startIndex={startIndex}
          endIndex={endIndex}
          totalItems={filtered.length}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          getPageNumbers={getPageNumbers}
        />
      )}

      {/* FILTER DRAWER */}
      <FilterDrawer
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        filters={filters}
        onApply={setFilters}
      />
    </div>
  )
}

// ============================================
// PAGINATION
// ============================================

type PaginationProps = {
  page: number
  totalPages: number
  pageSize: number
  startIndex: number
  endIndex: number
  totalItems: number
  onPageChange: (p: number) => void
  onPageSizeChange: (s: number) => void
  getPageNumbers: () => (number | '...')[]
}

function Pagination({
  page,
  totalPages,
  pageSize,
  startIndex,
  endIndex,
  totalItems,
  onPageChange,
  onPageSizeChange,
  getPageNumbers,
}: PaginationProps) {
  const numbers = getPageNumbers()
  const canPrev = page > 1
  const canNext = page < totalPages

  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pt-6 border-t border-outline-variant/30">
      <div className="flex flex-wrap items-center gap-3 sm:gap-4">
        <p className="text-xs text-on-surface-variant">
          Menampilkan{' '}
          <span className="font-bold text-on-surface">
            {startIndex + 1}–{endIndex}
          </span>{' '}
          dari{' '}
          <span className="font-bold text-on-surface">{totalItems}</span>{' '}
          lowongan
        </p>

        <div className="flex items-center gap-2">
          <label
            htmlFor="pageSize"
            className="text-xs text-on-surface-variant font-medium"
          >
            Per halaman
          </label>
          <select
            id="pageSize"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="text-xs font-bold bg-surface-container-lowest border border-outline-variant/30 rounded-lg px-2 py-1.5 text-on-surface hover:border-primary/40 focus:outline-none focus:border-primary/60 cursor-pointer"
          >
            {PAGE_SIZE_OPTIONS.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      </div>

      <nav className="flex items-center justify-center gap-1" aria-label="Pagination">
        <button
          type="button"
          onClick={() => onPageChange(1)}
          disabled={!canPrev}
          className="hidden sm:flex w-9 h-9 items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={!canPrev}
          className="flex w-9 h-9 items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {numbers.map((n, i) =>
          n === '...' ? (
            <span
              key={`ellipsis-${i}`}
              className="w-9 h-9 flex items-center justify-center text-on-surface-variant text-sm select-none"
            >
              …
            </span>
          ) : (
            <button
              key={n}
              type="button"
              onClick={() => onPageChange(n)}
              aria-current={n === page ? 'page' : undefined}
              className={`
                min-w-[36px] h-9 px-2.5 flex items-center justify-center rounded-lg text-sm font-bold transition-all
                ${
                  n === page
                    ? 'bg-primary text-white shadow-sm shadow-primary/30'
                    : 'text-on-surface hover:bg-surface-container'
                }
              `}
            >
              {n}
            </button>
          )
        )}

        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={!canNext}
          className="flex w-9 h-9 items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => onPageChange(totalPages)}
          disabled={!canNext}
          className="hidden sm:flex w-9 h-9 items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronsRight className="w-4 h-4" />
        </button>
      </nav>
    </div>
  )
}