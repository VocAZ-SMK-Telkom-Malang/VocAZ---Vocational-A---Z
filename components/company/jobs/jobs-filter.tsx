// components/company/jobs/jobs-filter.tsx
'use client'

import { Search, X } from 'lucide-react'
import { useState, useEffect } from 'react'

type Props = {
  initialSearch: string
  initialStatus: string
  initialEmploymentType: string
  initialWorkMode: string
  initialCity: string
  initialSort: string

  cities: string[]
  employmentTypes: string[]
  workModes: string[]

  onFilterChange: (filters: {
    search?: string
    status?: string
    employmentType?: string
    workMode?: string
    city?: string
    sort?: string
  }) => void
}

const STATUS_OPTIONS = [
  { value: 'all', label: 'Semua Status' },
  { value: 'active', label: 'Aktif' },
  { value: 'draft', label: 'Draft' },
  { value: 'closed', label: 'Ditutup' },
  { value: 'archived', label: 'Arsip' },
]

const SORT_OPTIONS = [
  { value: 'newest', label: 'Terbaru' },
  { value: 'oldest', label: 'Terlama' },
  { value: 'most_applicants', label: 'Terbanyak Pelamar' },
  { value: 'deadline', label: 'Deadline Terdekat' },
]

const EMPLOYMENT_LABEL: Record<string, string> = {
  internship: 'Internship',
  part_time: 'Part Time',
  full_time: 'Full Time',
  freelance: 'Freelance',
  volunteer: 'Volunteer',
  contract: 'Contract',
}

const WORK_MODE_LABEL: Record<string, string> = {
  onsite: 'On-site',
  remote: 'Remote',
  hybrid: 'Hybrid',
}

export function JobsFilter({
  initialSearch,
  initialStatus,
  initialEmploymentType,
  initialWorkMode,
  initialCity,
  initialSort,
  cities,
  employmentTypes,
  workModes,
  onFilterChange,
}: Props) {
  const [search, setSearch] = useState(initialSearch)
  const [status, setStatus] = useState(initialStatus)
  const [employmentType, setEmploymentType] = useState(initialEmploymentType)
  const [workMode, setWorkMode] = useState(initialWorkMode)
  const [city, setCity] = useState(initialCity)
  const [sort, setSort] = useState(initialSort)

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search !== initialSearch) {
        onFilterChange({ search })
      }
    }, 400)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  const hasActiveFilter =
    search ||
    status !== 'all' ||
    employmentType !== 'all' ||
    workMode !== 'all' ||
    city !== 'all' ||
    sort !== 'newest'

  const handleReset = () => {
    setSearch('')
    setStatus('all')
    setEmploymentType('all')
    setWorkMode('all')
    setCity('all')
    setSort('newest')
    onFilterChange({
      search: '',
      status: 'all',
      employmentType: 'all',
      workMode: 'all',
      city: 'all',
      sort: 'newest',
    })
  }

  return (
    <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-4">
      <div className="flex flex-col lg:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari lowongan..."
            className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-surface-container-low border border-transparent focus:border-primary/30 focus:bg-surface-container-lowest focus:outline-none text-sm text-on-surface placeholder:text-on-surface-variant/60 transition"
          />
        </div>

        {/* Status */}
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value)
            onFilterChange({ status: e.target.value })
          }}
          className="px-3 py-2.5 rounded-xl bg-surface-container-low border border-transparent focus:border-primary/30 focus:outline-none text-sm text-on-surface cursor-pointer"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Employment Type */}
        <select
          value={employmentType}
          onChange={(e) => {
            setEmploymentType(e.target.value)
            onFilterChange({ employmentType: e.target.value })
          }}
          className="px-3 py-2.5 rounded-xl bg-surface-container-low border border-transparent focus:border-primary/30 focus:outline-none text-sm text-on-surface cursor-pointer"
        >
          <option value="all">Semua Tipe</option>
          {employmentTypes.map((t) => (
            <option key={t} value={t}>
              {EMPLOYMENT_LABEL[t] ?? t}
            </option>
          ))}
        </select>

        {/* Work Mode */}
        <select
          value={workMode}
          onChange={(e) => {
            setWorkMode(e.target.value)
            onFilterChange({ workMode: e.target.value })
          }}
          className="px-3 py-2.5 rounded-xl bg-surface-container-low border border-transparent focus:border-primary/30 focus:outline-none text-sm text-on-surface cursor-pointer"
        >
          <option value="all">Semua Mode</option>
          {workModes.map((m) => (
            <option key={m} value={m}>
              {WORK_MODE_LABEL[m] ?? m}
            </option>
          ))}
        </select>

        {/* City */}
        <select
          value={city}
          onChange={(e) => {
            setCity(e.target.value)
            onFilterChange({ city: e.target.value })
          }}
          className="px-3 py-2.5 rounded-xl bg-surface-container-low border border-transparent focus:border-primary/30 focus:outline-none text-sm text-on-surface cursor-pointer"
        >
          <option value="all">Semua Lokasi</option>
          {cities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        {/* Sort */}
        <select
          value={sort}
          onChange={(e) => {
            setSort(e.target.value)
            onFilterChange({ sort: e.target.value })
          }}
          className="px-3 py-2.5 rounded-xl bg-surface-container-low border border-transparent focus:border-primary/30 focus:outline-none text-sm text-on-surface cursor-pointer"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Reset */}
        {hasActiveFilter && (
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-surface-container text-on-surface-variant hover:bg-surface-container-high text-sm font-medium transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
            Reset
          </button>
        )}
      </div>
    </div>
  )
}