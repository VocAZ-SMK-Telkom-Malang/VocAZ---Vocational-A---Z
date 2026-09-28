// components/lowongan/jobs-filter.tsx
'use client'

import { StatStrip, type StatItem } from '@/components/shared/stat-strip'
import { useState, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  Search,
  X,
  Sparkles,
  Building2,
  Briefcase,
  Radio,
  MapPin,
  Laptop,
  Star,
} from 'lucide-react'
import type { JobFilterOptions } from '@/lib/lowongan/queries'

type Props = {
  options: JobFilterOptions
  stats: {
    totalJobs: number
    totalCompanies: number
    activeJobs: number
  }
}

const EMPLOYMENT_LABELS: Record<string, string> = {
  internship: 'Magang Vokasi',
  part_time: 'Part-time',
  full_time: 'Full-time',
  freelance: 'Freelance',
  volunteer: 'Volunteer',
  contract: 'Kontrak',
}

const WORK_MODE_LABELS: Record<string, string> = {
  onsite: 'Onsite',
  remote: 'Remote',
  hybrid: 'Hybrid',
}

const EXP_LABELS: Record<string, string> = {
  entry: 'Entry Level',
  junior: 'Junior',
  mid: 'Mid Level',
  senior: 'Senior',
}

export function JobsFilter({ options, stats }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()

  const [search, setSearch] = useState(searchParams.get('search') || '')

  const currentCity = searchParams.get('city') || 'all'
  const currentType = searchParams.get('type') || 'all'
  const currentMode = searchParams.get('mode') || 'all'
  const currentExp = searchParams.get('exp') || 'all'

  function updateURL(overrides: Record<string, string | undefined>) {
    const params = new URLSearchParams(searchParams.toString())
    Object.entries(overrides).forEach(([key, value]) => {
      if (value && value !== 'all') params.set(key, value)
      else params.delete(key)
    })
    params.delete('page')
    startTransition(() => {
      router.push(`/lowongan?${params.toString()}`)
    })
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    updateURL({ search: search.trim() || undefined })
  }

  function reset() {
    setSearch('')
    router.push('/lowongan')
  }

  const hasFilter =
    currentCity !== 'all' ||
    currentType !== 'all' ||
    currentMode !== 'all' ||
    currentExp !== 'all' ||
    !!searchParams.get('search')

  // Stats data
  const statsData: StatItem[] = [
    {
      icon: Building2,
      iconColor: 'text-primary',
      iconBg: 'bg-primary/10',
      value: `${stats.totalCompanies}+`,
      label: 'Perusahaan',
    },
    {
      icon: Briefcase,
      iconColor: 'text-[#ea580c]',
      iconBg: 'bg-[#ea580c]/10',
      value: `${stats.totalJobs}+`,
      label: 'Lowongan',
    },
    {
      icon: Radio,
      iconColor: 'text-emerald-600',
      iconBg: 'bg-emerald-500/10',
      value: 'Live',
      label: 'Diperbarui',
    },
  ]

  return (
    <>
      {/* HERO */}
      <section className="relative w-full overflow-hidden pt-8 md:pt-12 pb-20 md:pb-24">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[720px] h-[360px] bg-gradient-to-r from-[#ff5757]/15 via-[#ffdcc3]/30 to-[#ffdad6]/20 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute top-1/3 -right-20 w-80 h-80 bg-[#ffb77d]/20 blur-2xl rounded-full pointer-events-none" />
        <div className="absolute bottom-0 -left-20 w-72 h-72 bg-[#ffdcc3]/20 blur-3xl rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-container-lowest/90 backdrop-blur-md shadow-sm mb-6 ring-1 ring-outline-variant/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            <span className="font-mono text-[10px] text-on-surface font-bold tracking-[0.08em] uppercase">
              Bursa Kerja Vokasi Indonesia Terverifikasi
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-on-surface max-w-3xl tracking-tight leading-[1.1]">
            Your Next Opportunity{' '}
            <span className="bg-gradient-to-r from-[#ff5757] via-[#ea580c] to-[#f59e0b] bg-clip-text text-transparent">
              Is Already Here.
            </span>
          </h1>

          <p className="mt-4 text-sm sm:text-base text-on-surface-variant max-w-xl leading-relaxed">
            Real companies. Real openings. Built for certified SMK graduates
            ready to launch direct industry careers.
          </p>

          {/* Stats Strip */}
          <div className="mt-8 w-full flex justify-center">
            <StatStrip stats={statsData} />
          </div>
        </div>
      </section>

      {/* SEARCH & FILTER */}
      <section className="relative z-20 -mt-14 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-surface-container-lowest rounded-3xl p-3 md:p-4 shadow-[0_16px_40px_-10px_rgba(220,38,38,0.12)] ring-1 ring-outline-variant/20">
          {/* Search */}
          <form
            onSubmit={handleSearch}
            className="flex flex-col md:flex-row items-stretch md:items-center gap-2 bg-surface-container-low rounded-2xl p-1.5"
          >
            <div className="flex items-center w-full px-3 gap-2.5">
              <Search className="w-4 h-4 text-on-surface-variant shrink-0" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari posisi, perusahaan, atau kota..."
                className="w-full bg-transparent border-0 text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none py-2.5"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="p-1 rounded-full text-on-surface-variant hover:bg-surface-container transition-colors shrink-0"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <button
              type="submit"
              className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#ff5757] via-[#ea580c] to-[#dc2626] text-white text-sm font-semibold px-6 py-3 rounded-xl shadow-md hover:brightness-105 active:scale-[0.98] transition-all shrink-0"
            >
              <Sparkles className="w-4 h-4" />
              Cari Lowongan
            </button>
          </form>

          {/* Filter chips */}
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <button
              onClick={() => updateURL({ type: undefined })}
              className={
                currentType === 'all'
                  ? 'px-4 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-[#ff5757] to-[#ea580c] text-white shadow-sm shrink-0 transition-all'
                  : 'px-4 py-1.5 rounded-full text-xs font-semibold bg-surface-container-low text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all shrink-0'
              }
            >
              Semua
            </button>

            {options.employmentTypes.slice(0, 4).map((type) => {
              const isActive = currentType === type
              return (
                <button
                  key={type}
                  onClick={() =>
                    updateURL({ type: isActive ? undefined : type })
                  }
                  className={
                    isActive
                      ? 'px-4 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-[#ff5757] to-[#ea580c] text-white shadow-sm shrink-0 transition-all'
                      : 'px-4 py-1.5 rounded-full text-xs font-semibold bg-surface-container-low text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all shrink-0'
                  }
                >
                  {EMPLOYMENT_LABELS[type] || type}
                </button>
              )
            })}

            <div className="h-5 w-px bg-outline-variant/40 mx-1 shrink-0" />

            {/* City dropdown */}
            <div className="relative shrink-0">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-on-surface-variant pointer-events-none" />
              <select
                value={currentCity}
                onChange={(e) => updateURL({ city: e.target.value })}
                className="appearance-none bg-surface-container-low text-on-surface-variant hover:bg-surface-container hover:text-on-surface text-xs font-semibold pl-8 pr-8 py-1.5 rounded-full cursor-pointer focus:outline-none transition-all"
              >
                <option value="all">Semua Kota</option>
                {options.cities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Work mode */}
            <div className="relative shrink-0">
              <Laptop className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-on-surface-variant pointer-events-none" />
              <select
                value={currentMode}
                onChange={(e) => updateURL({ mode: e.target.value })}
                className="appearance-none bg-surface-container-low text-on-surface-variant hover:bg-surface-container hover:text-on-surface text-xs font-semibold pl-8 pr-8 py-1.5 rounded-full cursor-pointer focus:outline-none transition-all"
              >
                <option value="all">Semua Mode</option>
                {Object.entries(WORK_MODE_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            {/* Experience */}
            <div className="relative shrink-0">
              <Star className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-on-surface-variant pointer-events-none" />
              <select
                value={currentExp}
                onChange={(e) => updateURL({ exp: e.target.value })}
                className="appearance-none bg-surface-container-low text-on-surface-variant hover:bg-surface-container hover:text-on-surface text-xs font-semibold pl-8 pr-8 py-1.5 rounded-full cursor-pointer focus:outline-none transition-all"
              >
                <option value="all">Semua Level</option>
                {Object.entries(EXP_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            {hasFilter && (
              <button
                onClick={reset}
                className="ml-auto inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:bg-primary/5 px-2.5 py-1.5 rounded-full transition-colors shrink-0"
              >
                <X className="w-3.5 h-3.5" />
                Reset
              </button>
            )}
          </div>
        </div>
      </section>
    </>
  )
}