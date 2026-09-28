// components/showcase/public/showcase-hero.tsx
'use client'

import { useState } from 'react'
import { Search, Sparkles, X, Play, Video, Users, Eye, Award } from 'lucide-react'
import { StatStrip, type StatItem } from '@/components/shared/stat-strip'

type Props = {
  categories: string[]
  stats?: {
    totalVideos: number
    totalStudents: number
    totalViews: number
  }
  initialFilters: {
    search: string
    category: string
    sort: string
  }
  onSearch: (q: string) => void
  onCategoryChange: (cat: string) => void
}

export function ShowcaseHero({
  categories,
  stats = { totalVideos: 0, totalStudents: 0, totalViews: 0 },
  initialFilters,
  onSearch,
  onCategoryChange,
}: Props) {
  const [search, setSearch] = useState(initialFilters.search)
  const [active, setActive] = useState(initialFilters.category || 'all')

  const quickPills = categories.slice(0, 5)

  const statsData: StatItem[] = [
    {
      icon: Video,
      iconColor: 'text-primary',
      iconBg: 'bg-primary/10',
      value: `${stats.totalVideos}+`,
      label: 'Video Showcase',
    },
    {
      icon: Users,
      iconColor: 'text-[#ea580c]',
      iconBg: 'bg-[#ea580c]/10',
      value: `${stats.totalStudents}+`,
      label: 'Talenta Aktif',
    },
    {
      icon: Eye,
      iconColor: 'text-secondary',
      iconBg: 'bg-secondary-fixed/50',
      value:
        stats.totalViews >= 1000
          ? `${(stats.totalViews / 1000).toFixed(1)}k`
          : `${stats.totalViews}`,
      label: 'Total Views',
    },
    {
      icon: Award,
      iconColor: 'text-primary',
      iconBg: 'bg-primary-fixed/50',
      value: '100%',
      label: 'BNSP Verified',
    },
  ]

  return (
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
            Live Talent Reels &amp; Demonstrasi Nyata
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-on-surface max-w-3xl tracking-tight leading-[1.1]">
          Talent Isn&apos;t Just a Profile.{' '}
          <span className="bg-gradient-to-r from-[#ff5757] via-[#ea580c] to-[#f59e0b] bg-clip-text text-transparent">
            It&apos;s Proof.
          </span>
        </h1>

        <p className="mt-4 text-sm sm:text-base text-on-surface-variant max-w-xl leading-relaxed">
          Tonton siswa SMK membangun, memperbaiki, koding, dan berkarya — skill
          yang bisa kamu{' '}
          <em className="not-italic font-semibold text-on-surface">lihat</em>,
          bukan cuma dibaca.
        </p>

        {/* Stats Strip */}
        <div className="mt-8 w-full flex justify-center">
          <StatStrip stats={statsData} />
        </div>
      </div>

      {/* SEARCH & FILTER */}
      <div className="relative z-20 -mt-14 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-surface-container-lowest rounded-3xl p-3 md:p-4 shadow-[0_16px_40px_-10px_rgba(220,38,38,0.12)] ring-1 ring-outline-variant/20">
          {/* Search */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              onSearch(search)
            }}
            className="flex flex-col md:flex-row items-stretch md:items-center gap-2 bg-surface-container-low rounded-2xl p-1.5"
          >
            <div className="flex items-center w-full px-3 gap-2.5">
              <Search className="w-4 h-4 text-on-surface-variant shrink-0" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari berdasarkan skill, sekolah, atau kategori..."
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
              Cari Video
            </button>
          </form>

          {/* Filter chips */}
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <button
              onClick={() => {
                setActive('all')
                onCategoryChange('all')
              }}
              className={
                active === 'all'
                  ? 'px-4 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-[#ff5757] to-[#ea580c] text-white shadow-sm shrink-0 transition-all'
                  : 'px-4 py-1.5 rounded-full text-xs font-semibold bg-surface-container-low text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all shrink-0'
              }
            >
              Semua
            </button>

            {quickPills.map((cat) => {
              const isActive = active === cat
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setActive(isActive ? 'all' : cat)
                    onCategoryChange(isActive ? 'all' : cat)
                  }}
                  className={
                    isActive
                      ? 'px-4 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-[#ff5757] to-[#ea580c] text-white shadow-sm shrink-0 transition-all'
                      : 'px-4 py-1.5 rounded-full text-xs font-semibold bg-surface-container-low text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all shrink-0'
                  }
                >
                  {cat}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}