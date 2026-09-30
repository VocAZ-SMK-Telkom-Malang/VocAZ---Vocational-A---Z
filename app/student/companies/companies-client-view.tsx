// app/student/companies/companies-client-view.tsx
'use client'

import { useMemo, useState, useEffect } from 'react'
import {
  Search,
  SlidersHorizontal,
  X,
  Compass,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'
import { CompanyCard } from '@/components/student/companies/company-card'
import { FeaturedCompanies } from '@/components/student/companies/featured-companies'
import { CompaniesEmpty } from '@/components/student/companies/companies-empty'
import { CompanyFilterDrawer } from '@/components/student/companies/company-filter-drawer'
import {
  DEFAULT_COMPANY_FILTERS,
  type Company,
  type CompanyFilters,
} from '@/components/student/companies/types'

const PAGE_SIZE_OPTIONS = [6, 9, 12, 18] as const

type Props = {
  initialCompanies: Company[]
}

export function CompaniesClientView({ initialCompanies }: Props) {
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState<CompanyFilters>(DEFAULT_COMPANY_FILTERS)
  const [filterOpen, setFilterOpen] = useState(false)
  const [companies, setCompanies] = useState<Company[]>(initialCompanies)

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState<number>(9)

  // Sync kalau server data berubah
  useEffect(() => {
    setCompanies(initialCompanies)
  }, [initialCompanies])

  // ============================================
  // FILTER
  // ============================================
  const filtered = useMemo(() => {
    return companies.filter((c) => {
      if (query) {
        const q = query.toLowerCase()
        const hit =
          c.name.toLowerCase().includes(q) ||
          c.tagline.toLowerCase().includes(q) ||
          c.industry.toLowerCase().includes(q)
        if (!hit) return false
      }
      if (filters.industries.length > 0 && !filters.industries.includes(c.industry))
        return false
      if (filters.locations.length > 0 && !filters.locations.includes(c.location))
        return false
      if (filters.sizes.length > 0 && !filters.sizes.includes(c.size))
        return false
      if (filters.verifiedOnly && !c.verified) return false
      return true
    })
  }, [companies, query, filters])

  // Semua perusahaan buat marquee
  const marqueeCompanies = useMemo(() => companies, [companies])

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
  // ACTIVE FILTER CHIPS
  // ============================================
  const activeChips: { label: string; onRemove: () => void }[] = []
  filters.industries.forEach((i) =>
    activeChips.push({
      label: i,
      onRemove: () =>
        setFilters({
          ...filters,
          industries: filters.industries.filter((x) => x !== i),
        }),
    })
  )
  filters.locations.forEach((l) =>
    activeChips.push({
      label: l,
      onRemove: () =>
        setFilters({
          ...filters,
          locations: filters.locations.filter((x) => x !== l),
        }),
    })
  )
  filters.sizes.forEach((s) =>
    activeChips.push({
      label: s,
      onRemove: () =>
        setFilters({ ...filters, sizes: filters.sizes.filter((x) => x !== s) }),
    })
  )
  if (filters.verifiedOnly) {
    activeChips.push({
      label: '✓ Terverifikasi',
      onRemove: () => setFilters({ ...filters, verifiedOnly: false }),
    })
  }

  return (
    <div className="space-y-6">
      {/* HERO */}
      <div className="relative overflow-hidden rounded-2xl bg-surface-container-lowest border border-outline-variant/30 p-6 sm:p-8">
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

        <div className="relative">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-[11px] font-bold uppercase tracking-wider mb-3">
            <Compass className="w-3 h-3" />
            Career Hub
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-on-surface tracking-tight leading-tight">
            Perusahaan Mitra
          </h1>
          <p className="text-sm text-on-surface-variant mt-2 max-w-xl">
            Jelajahi direktori mitra industri VocAZ. Lihat profil, lowongan
            aktif, dan budaya kerja sebelum kamu melamar.
          </p>
        </div>
      </div>

      {/* MARQUEE */}
      <FeaturedCompanies companies={marqueeCompanies} />

      {/* SEARCH + FILTER (sticky) */}
      <div className="sticky top-16 z-20 -mx-4 sm:mx-0 px-4 sm:px-0 py-2 bg-[#FAF8F5]/80 backdrop-blur-md">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex-1 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/5 transition-all shadow-sm">
            <Search className="w-4 h-4 text-on-surface-variant shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari perusahaan, industri, atau tagline..."
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
              setFilters(DEFAULT_COMPANY_FILTERS)
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
        <CompaniesEmpty
          onReset={() => {
            setFilters(DEFAULT_COMPANY_FILTERS)
            setQuery('')
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {paginated.map((c) => (
            <CompanyCard key={c.id} company={c} />
          ))}
        </div>
      )}

      {/* PAGINATION */}
      {filtered.length > 0 && (
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pt-6 border-t border-outline-variant/30">
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <p className="text-xs text-on-surface-variant">
              Menampilkan{' '}
              <span className="font-bold text-on-surface">
                {startIndex + 1}–{endIndex}
              </span>{' '}
              dari{' '}
              <span className="font-bold text-on-surface">{filtered.length}</span>{' '}
              perusahaan
            </p>
            <div className="flex items-center gap-2">
              <label
                htmlFor="companyPageSize"
                className="text-xs text-on-surface-variant font-medium"
              >
                Per halaman
              </label>
              <select
                id="companyPageSize"
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
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

      {/* FILTER DRAWER */}
      <CompanyFilterDrawer
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        filters={filters}
        onApply={setFilters}
      />
    </div>
  )
}