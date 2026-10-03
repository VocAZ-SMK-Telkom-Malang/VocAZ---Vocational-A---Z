// components/company/talent/talent-filters.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  Search,
  SlidersHorizontal,
  X,
  Briefcase,
  MapPin,
  Zap,
  Award,
} from 'lucide-react'
import type { TalentFilterOptions } from '@/lib/queries/company-talent'

type Props = {
  filterOptions: TalentFilterOptions
  initialFilters: {
    search: string
    jobId: string
    minScore: number
    city: string
    skill: string
    openToWorkOnly: boolean
    sortBy: string
  }
}

export function TalentFilters({ filterOptions, initialFilters }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [search, setSearch] = useState(initialFilters.search)
  const [jobId, setJobId] = useState(initialFilters.jobId)
  const [minScore, setMinScore] = useState(initialFilters.minScore)
  const [city, setCity] = useState(initialFilters.city)
  const [skill, setSkill] = useState(initialFilters.skill)
  const [openToWorkOnly, setOpenToWorkOnly] = useState(
    initialFilters.openToWorkOnly
  )
  const [sortBy, setSortBy] = useState(initialFilters.sortBy)

  // Debounce search
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
    router.push(`/company/talent?${params.toString()}`)
  }

  function handleReset() {
    setSearch('')
    setJobId('')
    setMinScore(0)
    setCity('')
    setSkill('')
    setOpenToWorkOnly(false)
    setSortBy('match')
    router.push('/company/talent')
  }

  const hasActiveFilter =
    search ||
    jobId ||
    minScore > 0 ||
    city ||
    skill ||
    openToWorkOnly

  return (
    <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-4 space-y-3">
      {/* Row 1: Search + Reset */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama, skill, sekolah..."
            className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-surface-container-low border border-transparent focus:border-primary/30 focus:bg-surface-container-lowest focus:outline-none text-sm transition"
          />
        </div>
        {hasActiveFilter && (
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-surface-container text-on-surface-variant hover:bg-surface-container-high text-xs font-bold transition-colors shrink-0"
          >
            <X className="w-3.5 h-3.5" />
            Reset
          </button>
        )}
      </div>

      {/* Row 2: Job Selector (untuk match score) */}
      {filterOptions.jobs.length > 0 && (
        <div className="p-3 rounded-xl bg-primary/5 border border-primary/20">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-xs font-bold text-on-surface">
              Match dengan lowongan:
            </span>
          </div>
          <select
            value={jobId}
            onChange={(e) => {
              setJobId(e.target.value)
              updateURL({ jobId: e.target.value })
            }}
            className="w-full px-3 py-2 rounded-lg bg-surface-container-lowest border border-outline-variant/40 focus:border-primary/30 focus:outline-none text-sm font-semibold cursor-pointer"
          >
            <option value="">Pilih lowongan untuk hitung match score...</option>
            {filterOptions.jobs.map((j) => (
              <option key={j.id} value={j.id}>
                {j.title}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Row 3: Filters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <select
          value={skill}
          onChange={(e) => {
            setSkill(e.target.value)
            updateURL({ skill: e.target.value })
          }}
          className="px-3 py-2 rounded-lg bg-surface-container-low border border-transparent focus:border-primary/30 focus:outline-none text-xs font-semibold cursor-pointer"
        >
          <option value="">Semua Skill</option>
          {filterOptions.skills.slice(0, 100).map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        <select
          value={city}
          onChange={(e) => {
            setCity(e.target.value)
            updateURL({ city: e.target.value })
          }}
          className="px-3 py-2 rounded-lg bg-surface-container-low border border-transparent focus:border-primary/30 focus:outline-none text-xs font-semibold cursor-pointer"
        >
          <option value="">Semua Lokasi</option>
          {filterOptions.cities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => {
            setSortBy(e.target.value)
            updateURL({ sortBy: e.target.value })
          }}
          className="px-3 py-2 rounded-lg bg-surface-container-low border border-transparent focus:border-primary/30 focus:outline-none text-xs font-semibold cursor-pointer"
        >
          <option value="match">Match Tertinggi</option>
          <option value="newest">Terbaru</option>
          <option value="name">Nama (A-Z)</option>
        </select>

        <label className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-container-low cursor-pointer select-none">
          <input
            type="checkbox"
            checked={openToWorkOnly}
            onChange={(e) => {
              setOpenToWorkOnly(e.target.checked)
              updateURL({ openToWork: e.target.checked ? '1' : '' })
            }}
            className="w-3.5 h-3.5 rounded border-outline-variant text-primary"
          />
          <span className="text-xs font-bold text-on-surface">
            Open to Work
          </span>
        </label>
      </div>

      {/* Row 4: Min Score Slider */}
      {jobId && (
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-surface-container-low">
          <Award className="w-4 h-4 text-primary shrink-0" />
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
            onMouseUp={(e) => {
              updateURL({
                minScore: String((e.target as HTMLInputElement).value),
              })
            }}
            onTouchEnd={(e) => {
              updateURL({
                minScore: String((e.target as HTMLInputElement).value),
              })
            }}
            className="flex-1 accent-primary"
          />
          <span className="font-mono text-xs font-bold text-primary w-12 text-right">
            {minScore}%
          </span>
        </div>
      )}
    </div>
  )
}