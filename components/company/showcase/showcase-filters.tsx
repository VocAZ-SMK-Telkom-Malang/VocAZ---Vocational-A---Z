// components/company/showcase/showcase-filters.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  Search,
  Filter,
  X,
  LayoutGrid,
  Play,
  Briefcase,
  Zap,
  Clock,
  ChevronDown,
} from 'lucide-react'
import type { ShowcaseFilterOptions } from '@/lib/queries/company-showcase'

type ViewMode = 'grid' | 'reels'

type Props = {
  filterOptions: ShowcaseFilterOptions
  initialFilters: {
    search: string
    jobId: string
    minScore: number
    category: string
    durationFilter: string
    sortBy: string
  }
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
}

export function ShowcaseFilters({
  filterOptions,
  initialFilters,
  viewMode,
  onViewModeChange,
}: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [search, setSearch] = useState(initialFilters.search)
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (search !== initialFilters.search) {
        updateURL({ search })
      }
    }, 400)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  function updateURL(overrides: Record<string, string | undefined>) {
    const params = new URLSearchParams(searchParams.toString())
    Object.entries(overrides).forEach(([key, value]) => {
      if (value && value !== 'all' && value !== '' && value !== '0') {
        params.set(key, value)
      } else {
        params.delete(key)
      }
    })
    params.delete('page')
    router.push(`/company/showcase?${params.toString()}`)
  }

  function handleReset() {
    setSearch('')
    router.push('/company/showcase')
  }

  const activeFilterCount = [
    initialFilters.jobId,
    initialFilters.minScore > 0,
    initialFilters.category && initialFilters.category !== 'all',
    initialFilters.durationFilter && initialFilters.durationFilter !== 'all',
  ].filter(Boolean).length

  return (
    <>
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari talent, skill, atau video..."
            className="w-full pl-10 pr-3 py-2.5 rounded-full bg-surface-container-lowest border border-outline-variant/40 focus:border-primary/30 focus:outline-none text-sm transition"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-on-surface-variant hover:bg-surface-container"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {filterOptions.jobs.length > 0 && (
          <div className="relative">
            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-primary pointer-events-none" />
            <select
              value={initialFilters.jobId}
              onChange={(e) => updateURL({ jobId: e.target.value })}
              className="pl-9 pr-8 py-2.5 rounded-full bg-primary/5 border border-primary/20 text-sm font-semibold text-on-surface focus:border-primary/40 focus:outline-none cursor-pointer appearance-none"
            >
              <option value="">Pilih lowongan (match score)</option>
              {filterOptions.jobs.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.title}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-primary pointer-events-none" />
          </div>
        )}

        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-surface-container-lowest border border-outline-variant/40 text-on-surface text-sm font-bold hover:bg-surface-container transition-colors shrink-0"
        >
          <Filter className="w-3.5 h-3.5" />
          Filter
          {activeFilterCount > 0 && (
            <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>

        <div className="inline-flex items-center p-0.5 rounded-full bg-surface-container-lowest border border-outline-variant/40 shrink-0">
          <button
            type="button"
            onClick={() => onViewModeChange('grid')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
              viewMode === 'grid'
                ? 'bg-primary text-white'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            Grid
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange('reels')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
              viewMode === 'reels'
                ? 'bg-primary text-white'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            Reels
          </button>
        </div>
      </div>

      {/* Filter Drawer */}
      {drawerOpen && (
        <FilterDrawer
          filterOptions={filterOptions}
          initialFilters={initialFilters}
          onClose={() => setDrawerOpen(false)}
          onReset={handleReset}
        />
      )}
    </>
  )
}

function FilterDrawer({
  filterOptions,
  initialFilters,
  onClose,
  onReset,
}: {
  filterOptions: ShowcaseFilterOptions
  initialFilters: Props['initialFilters']
  onClose: () => void
  onReset: () => void
}) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [minScore, setMinScore] = useState(initialFilters.minScore)
  const [category, setCategory] = useState(initialFilters.category)
  const [durationFilter, setDurationFilter] = useState(
    initialFilters.durationFilter
  )
  const [sortBy, setSortBy] = useState(initialFilters.sortBy)

  function applyFilters() {
    const params = new URLSearchParams(searchParams.toString())

    if (minScore > 0) params.set('minScore', String(minScore))
    else params.delete('minScore')

    if (category && category !== 'all') params.set('category', category)
    else params.delete('category')

    if (durationFilter && durationFilter !== 'all')
      params.set('duration', durationFilter)
    else params.delete('duration')

    if (sortBy) params.set('sortBy', sortBy)
    else params.delete('sortBy')

    params.delete('page')
    router.push(`/company/showcase?${params.toString()}`)
    onClose()
  }

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-surface-container-lowest shadow-2xl flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-outline-variant/30">
          <h2 className="text-lg font-black text-on-surface">Filter</h2>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full hover:bg-surface-container flex items-center justify-center text-on-surface-variant"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {initialFilters.jobId && (
            <div>
              <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-3">
                Match Score Minimum
              </label>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-primary/5 border border-primary/20">
                <Zap className="w-4 h-4 text-primary shrink-0" />
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  value={minScore}
                  onChange={(e) => setMinScore(Number(e.target.value))}
                  className="flex-1 accent-primary"
                />
                <span className="font-mono text-sm font-bold text-primary w-12 text-right">
                  {minScore}%
                </span>
              </div>
            </div>
          )}

          {filterOptions.categories.length > 0 && (
            <div>
              <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-3">
                Kategori
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setCategory('all')}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                    category === 'all' || !category
                      ? 'bg-primary text-white'
                      : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                >
                  Semua
                </button>
                {filterOptions.categories.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCategory(c)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                      category === c
                        ? 'bg-primary text-white'
                        : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-3">
              Durasi Video
            </label>
            <div className="space-y-1.5">
              {[
                { value: 'all', label: 'Semua' },
                { value: 'short', label: 'Pendek (< 1 menit)' },
                { value: 'medium', label: 'Sedang (1-5 menit)' },
                { value: 'long', label: 'Panjang (> 5 menit)' },
              ].map((opt) => (
                <label
                  key={opt.value}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-surface-container cursor-pointer transition-colors"
                >
                  <input
                    type="radio"
                    name="duration"
                    checked={durationFilter === opt.value}
                    onChange={() => setDurationFilter(opt.value)}
                    className="w-4 h-4 text-primary"
                  />
                  <Clock className="w-3.5 h-3.5 text-on-surface-variant" />
                  <span className="text-sm text-on-surface">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-3">
              Urutkan
            </label>
            <div className="space-y-1.5">
              {[
                { value: 'match', label: 'Match Tertinggi' },
                { value: 'newest', label: 'Terbaru' },
                { value: 'popular', label: 'Terpopuler' },
                { value: 'views', label: 'Paling Banyak Dilihat' },
              ].map((opt) => (
                <label
                  key={opt.value}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-surface-container cursor-pointer transition-colors"
                >
                  <input
                    type="radio"
                    name="sortBy"
                    checked={sortBy === opt.value}
                    onChange={() => setSortBy(opt.value)}
                    className="w-4 h-4 text-primary"
                  />
                  <span className="text-sm text-on-surface">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 p-4 border-t border-outline-variant/30">
          <button
            type="button"
            onClick={onReset}
            className="flex-1 py-2.5 rounded-full bg-surface-container text-on-surface text-sm font-bold hover:bg-surface-container-high transition-colors"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={applyFilters}
            className="flex-1 py-2.5 rounded-full bg-primary text-white text-sm font-bold hover:bg-primary-container transition-colors"
          >
            Terapkan
          </button>
        </div>
      </div>
    </>
  )
}