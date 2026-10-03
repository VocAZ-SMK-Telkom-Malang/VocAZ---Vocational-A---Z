// components/company/saved/saved-filters.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, X, MapPin, Briefcase } from 'lucide-react'
import type { SavedFilterOptions } from '@/lib/queries/company-saved'

type Props = {
  filterOptions: SavedFilterOptions
  initialFilters: {
    search: string
    city: string
    skill: string
    openToWorkOnly: boolean
    sortBy: string
  }
}

export function SavedFilters({ filterOptions, initialFilters }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(initialFilters.search)

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
      if (value && value !== 'all' && value !== '') {
        params.set(key, value)
      } else {
        params.delete(key)
      }
    })
    params.delete('page')
    router.push(`/company/saved?${params.toString()}`)
  }

  function handleReset() {
    setSearch('')
    router.push('/company/saved')
  }

  const hasFilter =
    initialFilters.search ||
    initialFilters.city ||
    initialFilters.skill ||
    initialFilters.openToWorkOnly

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative flex-1 min-w-[240px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari nama, skill, atau sekolah..."
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

      {filterOptions.cities.length > 0 && (
        <select
          value={initialFilters.city}
          onChange={(e) => updateURL({ city: e.target.value })}
          className="px-4 py-2.5 rounded-full bg-surface-container-lowest border border-outline-variant/40 focus:border-primary/30 focus:outline-none text-sm font-semibold cursor-pointer"
        >
          <option value="">Semua Lokasi</option>
          {filterOptions.cities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      )}

      <select
        value={initialFilters.sortBy}
        onChange={(e) => updateURL({ sortBy: e.target.value })}
        className="px-4 py-2.5 rounded-full bg-surface-container-lowest border border-outline-variant/40 focus:border-primary/30 focus:outline-none text-sm font-semibold cursor-pointer"
      >
        <option value="newest">Terbaru Disimpan</option>
        <option value="oldest">Terlama Disimpan</option>
        <option value="name">Nama A-Z</option>
      </select>

      <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-surface-container-lowest border border-outline-variant/40 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={initialFilters.openToWorkOnly}
          onChange={(e) =>
            updateURL({ openToWork: e.target.checked ? '1' : '' })
          }
          className="w-3.5 h-3.5 rounded border-outline-variant text-primary"
        />
        <span className="text-xs font-bold text-on-surface">
          Open to Work
        </span>
      </label>

      {hasFilter && (
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-full bg-surface-container text-on-surface-variant hover:bg-surface-container-high text-xs font-bold transition-colors"
        >
          <X className="w-3.5 h-3.5" />
          Reset
        </button>
      )}
    </div>
  )
}