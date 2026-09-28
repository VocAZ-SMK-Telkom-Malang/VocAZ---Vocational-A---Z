// components/perusahaan/companies-filter.tsx
'use client'

import { StatStrip, type StatItem } from '@/components/shared/stat-strip'
import { useState, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  Search,
  X,
  Sparkles,
  Building2,
  Award,
  Briefcase,
} from 'lucide-react'

type Props = {
  industries: string[]
  stats: {
    totalCompanies: number
    verifiedCompanies: number
    totalJobs: number
  }
}

export function CompaniesFilter({ industries, stats }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()

  const [search, setSearch] = useState(searchParams.get('search') || '')

  const currentIndustry = searchParams.get('industry') || 'all'
  const verifiedOnly = searchParams.get('verified') === 'true'

  function updateURL(overrides: Record<string, string | undefined>) {
    const params = new URLSearchParams(searchParams.toString())
    Object.entries(overrides).forEach(([key, value]) => {
      if (value && value !== 'all') params.set(key, value)
      else params.delete(key)
    })
    params.delete('page')
    startTransition(() => {
      router.push(`/perusahaan?${params.toString()}`)
    })
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    updateURL({ search: search.trim() || undefined })
  }

  function reset() {
    setSearch('')
    router.push('/perusahaan')
  }

  const hasFilter =
    currentIndustry !== 'all' || verifiedOnly || !!searchParams.get('search')

  // Stats data
  const statsData: StatItem[] = [
    {
      icon: Building2,
      iconColor: 'text-tertiary',
      iconBg: 'bg-tertiary-fixed/50',
      value: `${stats.totalCompanies}+`,
      label: 'Perusahaan',
    },
    {
      icon: Award,
      iconColor: 'text-secondary',
      iconBg: 'bg-secondary-fixed/50',
      value: `${stats.verifiedCompanies}`,
      label: 'Terverifikasi',
    },
    {
      icon: Briefcase,
      iconColor: 'text-primary',
      iconBg: 'bg-primary-fixed/50',
      value: `${stats.totalJobs}+`,
      label: 'Lowongan Aktif',
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
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-container-lowest/90 backdrop-blur-md shadow-sm mb-6 ring-1 ring-outline-variant/20">
            <Award className="w-3.5 h-3.5 text-tertiary fill-current" />
            <span className="font-mono text-[10px] text-on-surface font-bold tracking-[0.08em] uppercase">
              Ekosistem Kemitraan DUDI &amp; Vokasi
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-on-surface max-w-4xl tracking-tight leading-[1.1]">
            Companies That Believe in{' '}
            <span className="bg-gradient-to-r from-primary-container via-primary to-tertiary-container bg-clip-text text-transparent">
              SMK Talent.
            </span>
          </h1>

          <p className="mt-4 text-sm sm:text-base text-on-surface-variant max-w-2xl leading-relaxed">
            From high-growth innovators to national market leaders,
            forward-thinking enterprises build and scale skilled operational
            teams directly with verified vocational graduates.
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
                placeholder="Cari perusahaan, industri, atau kota..."
                className="w-full bg-transparent border-0 text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none py-2.5"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="p-1 rounded-full text-on-surface-variant hover:bg-surface-container transition-colors shrink-0"
                  aria-label="Clear"
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
              Cari Perusahaan
            </button>
          </form>

          {/* Filter chips */}
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <button
              onClick={() =>
                updateURL({ industry: undefined, verified: undefined })
              }
              className={
                currentIndustry === 'all' && !verifiedOnly
                  ? 'px-4 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-[#ff5757] to-[#ea580c] text-white shadow-sm shrink-0 transition-all'
                  : 'px-4 py-1.5 rounded-full text-xs font-semibold bg-surface-container-low text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all shrink-0'
              }
            >
              Semua
            </button>

            {industries.slice(0, 5).map((ind) => {
              const isActive = currentIndustry === ind
              return (
                <button
                  key={ind}
                  onClick={() =>
                    updateURL({ industry: isActive ? undefined : ind })
                  }
                  className={
                    isActive
                      ? 'px-4 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-[#ff5757] to-[#ea580c] text-white shadow-sm shrink-0 transition-all'
                      : 'px-4 py-1.5 rounded-full text-xs font-semibold bg-surface-container-low text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all shrink-0'
                  }
                >
                  {ind}
                </button>
              )
            })}

            <button
              onClick={() =>
                updateURL({ verified: verifiedOnly ? undefined : 'true' })
              }
              className={
                verifiedOnly
                  ? 'px-4 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-[#ff5757] to-[#ea580c] text-white shadow-sm shrink-0 inline-flex items-center gap-1.5 transition-all'
                  : 'px-4 py-1.5 rounded-full text-xs font-semibold bg-surface-container-low text-on-surface-variant hover:bg-surface-container transition-all shrink-0 inline-flex items-center gap-1.5'
              }
            >
              <Award className="w-3 h-3" />
              Mitra BNSP / BKK
            </button>

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