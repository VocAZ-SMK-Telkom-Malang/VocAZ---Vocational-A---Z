// components/talenta/talents-filter.tsx
'use client'

import { StatStrip, type StatItem } from '@/components/shared/stat-strip'
import { useState, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  Search,
  X,
  Sparkles,
  Users,
  Award,
  Video,
  GraduationCap,
  MapPin,
  BadgeCheck,
  Briefcase,
} from 'lucide-react'

type Props = {
  options: {
    cities: string[]
    programs: string[]
  }
  stats: {
    totalTalents: number
    verifiedTalents: number
    openToWork: number
    totalSkills: number
  }
}

export function TalentsFilter({ options, stats }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()

  const [search, setSearch] = useState(searchParams.get('search') || '')

  const currentCity = searchParams.get('city') || 'all'
  const currentMajor = searchParams.get('major') || 'all'
  const currentStatus = searchParams.get('status') || 'all'

  function updateURL(overrides: Record<string, string | undefined>) {
    const params = new URLSearchParams(searchParams.toString())
    Object.entries(overrides).forEach(([key, value]) => {
      if (value && value !== 'all') params.set(key, value)
      else params.delete(key)
    })
    params.delete('page')
    startTransition(() => {
      router.push(`/talenta?${params.toString()}`)
    })
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    updateURL({ search: search.trim() || undefined })
  }

  function reset() {
    setSearch('')
    router.push('/talenta')
  }

  const hasFilter =
    currentCity !== 'all' ||
    currentMajor !== 'all' ||
    currentStatus !== 'all' ||
    !!searchParams.get('search')

  // Stats data — di LUAR return, di dalam component
  const statsData: StatItem[] = [
    {
      icon: Users,
      iconColor: 'text-primary',
      iconBg: 'bg-primary/10',
      value: `${stats.totalTalents}+`,
      label: 'Verified Talents',
    },
    {
      icon: Video,
      iconColor: 'text-[#ea580c]',
      iconBg: 'bg-[#ea580c]/10',
      value: `${stats.totalSkills}+`,
      label: 'Skill Categories',
    },
    {
      icon: GraduationCap,
      iconColor: 'text-secondary',
      iconBg: 'bg-secondary-fixed/50',
      value: `${stats.verifiedTalents}+`,
      label: 'Mitra SMK & BKK',
    },
    {
      icon: BadgeCheck,
      iconColor: 'text-primary',
      iconBg: 'bg-primary-fixed/50',
      value: '100%',
      label: 'Validasi BNSP',
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
              Etalase Talenta Vokasi Terverifikasi Nasional
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-on-surface max-w-4xl tracking-tight leading-[1.1]">
            Real Skills. Real Students.{' '}
            <span className="bg-gradient-to-r from-[#ff5757] via-[#ea580c] to-[#f59e0b] bg-clip-text text-transparent">
              Real Proof.
            </span>
          </h1>

          <p className="mt-4 text-sm sm:text-base text-on-surface-variant max-w-2xl leading-relaxed">
            Setiap profil di sini didukung oleh rekaman proyek riil, validasi
            kompetensi BKK sekolah, dan sertifikasi BNSP resmi — bukan sekadar
            klaim resume.
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
                placeholder="Cari nama, sekolah, skill, atau jurusan..."
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
              Cari Talenta
            </button>
          </form>

          {/* Filter chips */}
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <button
              onClick={() => updateURL({ status: undefined })}
              className={
                currentStatus === 'all'
                  ? 'px-4 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-[#ff5757] to-[#ea580c] text-white shadow-sm shrink-0 transition-all'
                  : 'px-4 py-1.5 rounded-full text-xs font-semibold bg-surface-container-low text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all shrink-0'
              }
            >
              Semua
            </button>

            <button
              onClick={() =>
                updateURL({
                  status:
                    currentStatus === 'open_to_work'
                      ? undefined
                      : 'open_to_work',
                })
              }
              className={
                currentStatus === 'open_to_work'
                  ? 'px-4 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-[#ff5757] to-[#ea580c] text-white shadow-sm shrink-0 transition-all inline-flex items-center gap-1.5'
                  : 'px-4 py-1.5 rounded-full text-xs font-semibold bg-surface-container-low text-on-surface-variant hover:bg-surface-container transition-all shrink-0 inline-flex items-center gap-1.5'
              }
            >
              <Briefcase className="w-3 h-3" />
              Open to Work
            </button>

            <button
              onClick={() =>
                updateURL({
                  status:
                    currentStatus === 'verified' ? undefined : 'verified',
                })
              }
              className={
                currentStatus === 'verified'
                  ? 'px-4 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-[#ff5757] to-[#ea580c] text-white shadow-sm shrink-0 transition-all inline-flex items-center gap-1.5'
                  : 'px-4 py-1.5 rounded-full text-xs font-semibold bg-surface-container-low text-on-surface-variant hover:bg-surface-container transition-all shrink-0 inline-flex items-center gap-1.5'
              }
            >
              <Award className="w-3 h-3" />
              BNSP Verified
            </button>

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

            {/* Major dropdown */}
            <div className="relative shrink-0">
              <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-on-surface-variant pointer-events-none" />
              <select
                value={currentMajor}
                onChange={(e) => updateURL({ major: e.target.value })}
                className="appearance-none bg-surface-container-low text-on-surface-variant hover:bg-surface-container hover:text-on-surface text-xs font-semibold pl-8 pr-8 py-1.5 rounded-full cursor-pointer focus:outline-none transition-all max-w-[180px]"
              >
                <option value="all">Semua Jurusan</option>
                {options.programs.map((p) => (
                  <option key={p} value={p}>
                    {p}
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